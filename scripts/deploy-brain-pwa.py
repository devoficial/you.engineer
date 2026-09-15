"""Publish the standalone build to its own Netlify site. Never targets the portfolio."""
import argparse, hashlib, json, os, pathlib, time, urllib.error, urllib.parse, urllib.request

repo = pathlib.Path(__file__).resolve().parent.parent
config_path = repo / 'pwa/brain-garden.netlify.json'
root = repo / 'brain-garden-dist'
parser = argparse.ArgumentParser()
parser.add_argument('--create', metavar='NAME', help='Create a separate site only if no site config exists')
parser.add_argument('--account', help='Netlify team slug for creation')
args = parser.parse_args()
assert (root / 'sw.js').is_file() and (root / 'manifest.webmanifest').is_file(), 'Run npm run build:brain-pwa first.'
token = os.environ.get('NETLIFY_AUTH_TOKEN')
if not token:
    cli = pathlib.Path.home() / 'Library/Preferences/netlify/config.json'
    data = json.loads(cli.read_text())
    token = data['users'][data['userId']]['auth']['token']

def api(path, method='GET', data=None, content_type='application/json'):
    request = urllib.request.Request('https://api.netlify.com/api/v1/' + path, data=data, method=method,
        headers={'Authorization': 'Bearer ' + token, 'Content-Type': content_type})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                body = response.read()
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 4: raise
            time.sleep(2 ** (attempt + 1))

if config_path.exists():
    config = json.loads(config_path.read_text())
else:
    assert args.create and args.account, 'Creating a site requires --create NAME --account TEAM.'
    result = api(urllib.parse.quote(args.account, safe='') + '/sites', 'POST', json.dumps({'name': args.create, 'force_ssl': True, 'built_with_badge_enabled': False}).encode())
    config = {'site_id': result['id'], 'name': result['name'], 'url': result.get('ssl_url') or 'https://' + result['name'] + '.netlify.app', 'account_slug': args.account}
    config_path.write_text(json.dumps(config, indent=2) + '\n')
    print('Created standalone site:', config['url'], flush=True)
site = api('sites/' + config['site_id'])
assert site['id'] != '1010228a-5968-4615-b7ac-abd8b4542757', 'Refusing to replace the portfolio site.'
assert site['name'] == config['name'] and not site.get('custom_domain'), 'Check the destination before publishing.'
assert site.get('account_slug') == config['account_slug'], 'Unexpected Netlify team.'
# Edge-injected markup would invalidate the app shell's precache integrity.
if site.get('built_with_badge_enabled'):
    site = api('sites/' + config['site_id'], 'PATCH', json.dumps({'built_with_badge_enabled': False}).encode())
    assert site.get('built_with_badge_enabled') is False
files, uploads = {}, {}
for file in sorted(p for p in root.rglob('*') if p.is_file()):
    name = '/' + file.relative_to(root).as_posix().lower()
    assert name not in files, 'Case-insensitive filename collision: ' + name
    blob = file.read_bytes()
    digest = hashlib.sha1(blob).hexdigest()
    files[name] = digest
    uploads[digest] = (name, blob)
result = api('sites/' + config['site_id'] + '/deploys', 'POST', json.dumps({'files': files, 'title': 'Brain Garden · standalone PWA', 'draft': False}).encode())
deploy_id = result['id']
print('Deployment:', deploy_id, 'Uploads:', len(result.get('required', [])), flush=True)
for digest in result.get('required', []):
    name, blob = uploads[digest]
    for attempt in range(4):
        try:
            api('deploys/' + deploy_id + '/files/' + urllib.parse.quote(name.lstrip('/'), safe='/'), 'PUT', blob, 'application/octet-stream')
            break
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 3: raise
            time.sleep(2 ** (attempt + 1))
    print('Uploaded', name, flush=True)
for _ in range(20):
    deploy = api('deploys/' + deploy_id)
    if deploy['state'] == 'ready': break
    assert deploy['state'] not in ['error', 'failed'], 'Deployment failed.'
    time.sleep(2)
assert deploy['state'] == 'ready', 'Deploy not ready; inspect the existing deployment before retrying.'
assert api('sites/' + config['site_id'])['published_deploy']['id'] == deploy_id
(repo / 'outputs').mkdir(exist_ok=True)
(repo / 'outputs/brain-pwa-deploy.json').write_text(json.dumps({'site_id': config['site_id'], 'deploy_id': deploy_id, 'url': config['url']}, indent=2) + '\n')
print('Published:', config['url'], flush=True)
