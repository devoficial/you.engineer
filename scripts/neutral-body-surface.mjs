// Replace external genital detail with a smooth mannequin surface in model space.
// Relax only this local patch, keeping its boundary and the rest of the body fixed.
export function neutralizeBodySurface(vertices, indices) {
  const count = vertices.length / 3;
  const neighbors = Array.from({length: count}, () => new Set());
  for (let i = 0; i < indices.length; i += 3) {
    const face = indices.slice(i, i + 3);
    for (const a of face) for (const b of face) if (a !== b) neighbors[a].add(b);
  }
  // The source includes a second skin lining just inside the visible surface.
  // Identify the outer shell through its highest vertex (the crown of the head).
  let crown = 0;
  for (let i = 1; i < count; i++) if (vertices[i * 3 + 1] > vertices[crown * 3 + 1]) crown = i;
  const outer = new Set([crown]), queue = [crown];
  for (let i = 0; i < queue.length; i++) {
    for (const j of neighbors[queue[i]]) if (!outer.has(j)) { outer.add(j); queue.push(j); }
  }
  const selected = new Set();
  for (let i = 0; i < count; i++) {
    const [x, y, z] = vertices.slice(i * 3, i * 3 + 3);
    if (Math.abs(x) < .45 && y > 3.3 && y < 4.22 && z > -.2) selected.add(i);
  }
  const patch = [...selected].filter(i => outer.has(i) && [...neighbors[i]].every(j => selected.has(j)));
  const adjacent = patch.map(i => [...neighbors[i]]);
  const next = new Float64Array(patch.length * 3);
  for (let iteration = 0; iteration < 6000; iteration++) {
    let movement = 0;
    for (let p = 0; p < patch.length; p++) {
      for (let axis = 0; axis < 3; axis++) {
        const value = adjacent[p].reduce((sum, j) => sum + vertices[j * 3 + axis], 0) / adjacent[p].length;
        next[p * 3 + axis] = value;
        movement = Math.max(movement, Math.abs(value - vertices[patch[p] * 3 + axis]));
      }
    }
    for (let p = 0; p < patch.length; p++) {
      for (let axis = 0; axis < 3; axis++) vertices[patch[p] * 3 + axis] = next[p * 3 + axis];
    }
    if (movement < 1e-7) break;
  }
  // The former protrusion contracts into this patch. Weld its collapsed vertices
  // before recalculating normals so tiny overlapping faces cannot leave artifacts.
  const tolerance = .002;
  const cells = new Map();
  const remap = Array.from({length: count}, (_, i) => i);
  for (const i of patch) {
    const point = vertices.slice(i * 3, i * 3 + 3);
    const cell = point.map(v => Math.floor(v / tolerance));
    let nearest = i, distance = tolerance ** 2;
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      for (const j of cells.get([cell[0] + x, cell[1] + y, cell[2] + z].join(',')) || []) {
        const squared = point.reduce((sum, v, axis) => sum + (v - vertices[j * 3 + axis]) ** 2, 0);
        if (squared < distance) { nearest = j; distance = squared; }
      }
    }
    remap[i] = nearest;
    if (nearest === i) {
      const key = cell.join(',');
      if (!cells.has(key)) cells.set(key, []);
      cells.get(key).push(i);
    }
  }
  const faces = [], seen = new Set();
  for (let i = 0; i < indices.length; i += 3) {
    // Remove the old inner lining beneath this replacement patch. Relaxing both
    // nearly coincident shells independently would make them intersect.
    if (indices.slice(i, i + 3).some(j => selected.has(j) && !outer.has(j))) continue;
    const face = indices.slice(i, i + 3).map(j => remap[j]);
    const key = [...face].sort((a, b) => a - b).join(',');
    if (new Set(face).size === 3 && !seen.has(key)) { faces.push(...face); seen.add(key); }
  }
  // Close tiny source-shell gaps exposed by removing its inner lining.
  const edges = new Map();
  for (let i = 0; i < faces.length; i += 3) for (let edge = 0; edge < 3; edge++) {
    const a = faces[i + edge], b = faces[i + (edge + 1) % 3];
    const key = [Math.min(a, b), Math.max(a, b)].join(',');
    const entry = edges.get(key);
    if (entry) entry.count++; else edges.set(key, {a, b, count: 1});
  }
  const boundary = [...edges.values()].filter(({a, b, count}) => count === 1 && [a, b].every(i => outer.has(i) && selected.has(i)));
  const outgoing = new Map(boundary.map(edge => [edge.a, edge]));
  const visited = new Set();
  for (const start of boundary) {
    if (visited.has(start)) continue;
    const loop = [];
    let edge = start;
    while (edge && !visited.has(edge)) { loop.push(edge.a); visited.add(edge); edge = outgoing.get(edge.b); }
    if (edge !== start || loop.length < 3) continue;
    const center = vertices.length / 3;
    for (let axis = 0; axis < 3; axis++) vertices.push(loop.reduce((sum, i) => sum + vertices[i * 3 + axis], 0) / loop.length);
    for (let i = 0; i < loop.length; i++) faces.push(loop[(i + 1) % loop.length], loop[i], center);
  }
  const compact = [], packed = new Map();
  for (let i = 0; i < faces.length; i++) {
    const original = faces[i];
    if (!packed.has(original)) {
      packed.set(original, compact.length / 3);
      compact.push(...vertices.slice(original * 3, original * 3 + 3));
    }
    faces[i] = packed.get(original);
  }
  vertices.length = 0; indices.length = 0;
  for (const value of compact) vertices.push(value);
  for (const value of faces) indices.push(value);
  return patch.length;
}
