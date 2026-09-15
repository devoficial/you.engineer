export const videoThumbnail=video=>'https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg';
export const videoEmbedURL=video=>'https://www.youtube-nocookie.com/embed/'+video.id+'?rel=0&autoplay=1'+(video.time?'&start='+Math.floor(video.time):'');
export class VideoCard{
 constructor(host){this.host=host;this.key=null;this.video=null;this.lang='en';this.playing=false}
 set(video,lang,context){
  if(!/^[\w-]{11}$/.test(video.id))throw new Error('Invalid video ID');
  const key=context+':'+video.id+':'+(video.time||0);this.lang=lang;this.video=video;
  if(key===this.key){const button=this.host.querySelector('button');if(button){button.setAttribute('aria-label',this.label());button.querySelector('.video-poster-label').textContent=this.posterLabel()}return}
  this.key=key;this.playing=false;this.renderPoster();
 }
 label(){return (this.lang==='bn'?'ভিডিও চালাও: ':'Play video: ')+this.video.title}
 posterLabel(){return this.lang==='bn'?'এখানে দেখো':'Watch here'}
 renderPoster(){
  const button=document.createElement('button');button.className='video-poster';button.type='button';button.setAttribute('aria-label',this.label());
  const img=document.createElement('img');img.src=videoThumbnail(this.video);img.alt='';img.width=480;img.height=360;img.loading='lazy';img.referrerPolicy='strict-origin-when-cross-origin';img.onerror=()=>{img.hidden=true;button.classList.add('poster-unavailable')};
  const mark=document.createElement('span');mark.className='video-play-mark';mark.setAttribute('aria-hidden','true');mark.textContent='▶';
  const label=document.createElement('span');label.className='video-poster-label';label.textContent=this.posterLabel();
  button.append(img,mark,label);button.onclick=()=>this.play();this.host.replaceChildren(button);
 }
 play(){
  if(!this.video)return;this.playing=true;const frame=document.createElement('iframe');frame.src=videoEmbedURL(this.video);frame.title=this.video.title;frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';this.host.replaceChildren(frame);
 }
 stop(){this.playing=false;if(this.video)this.renderPoster()}
}
