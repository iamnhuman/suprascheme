import { readFile, writeFile, mkdir } from 'node:fs/promises';

// Build the root entry point and portable editions from an editable template.
// All runtime assets are embedded so index.html also works over file://.
let html = await readFile('src/index.html', 'utf8');
let css = await readFile('styles.css', 'utf8');
let js = await readFile('app.js', 'utf8');
let renderer = await readFile('renderer.js', 'utf8');
for (const font of ['anton', 'ibm-plex-mono']) {
  const data = (await readFile(`assets/fonts/${font}.ttf`)).toString('base64');
  css = css.replace(`assets/fonts/${font}.ttf`, `data:font/ttf;base64,${data}`);
}
const car = (await readFile('assets/supra.png')).toString('base64');
renderer = renderer.replace("car.src = 'assets/supra.png'", `car.src = 'data:image/png;base64,${car}'`);
const favicon = (await readFile('assets/favicon.svg')).toString('base64');
html = html.replace(/<link rel="preload"[^>]+>/g, '')
  .replace('assets/favicon.svg', `data:image/svg+xml;base64,${favicon}`)
  .replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`)
  .replace('<script src="app.js" defer></script>', '')
  .replace('<script src="renderer.js" defer></script>', '')
  .replace('</body>', `<script>${renderer}\n${js}</script></body>`);
await writeFile('index.html', html);
await mkdir('film', { recursive: true });
await writeFile('film/index.html', html);
await writeFile('film/portrait.html', html.replace('data-format="adaptive"', 'data-format="portrait"'));
console.log('Standalone players → index.html, film/index.html, film/portrait.html');
