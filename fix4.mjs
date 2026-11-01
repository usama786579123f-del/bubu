import fs from 'fs'
import sharp from 'sharp'

const kb = f => (fs.statSync(f).size / 1024).toFixed(0) + ' KB'

const jobs = [
  ['surprise-poster.png', 'surprise-poster.webp', 1080, 74],
  ['golden-journey.png', 'golden-journey.webp', 1200, 72],
  ['video-poster.png', 'video-poster.webp', 1000, 72],
]
for (const [src, dst, w, q] of jobs) {
  if (!fs.existsSync('public/' + src)) { console.log('MISSING  public/' + src); continue }
  await sharp('public/' + src).resize({ width: w, withoutEnlargement: true }).webp({ quality: q }).toFile('public/' + dst)
  console.log('image ok ' + dst + '  ' + kb('public/' + src) + ' -> ' + kb('public/' + dst))
}

let code = fs.readFileSync('src/App.tsx', 'utf8')
const a = 'alt="Golden Birthday Journey for Bubu" loading="lazy"'
if (code.includes(a)) { code = code.replace(a, 'alt="Golden Birthday Journey for Bubu" loading="eager" decoding="async"'); console.log('patched  lazy loading removed') }
else console.log('already/skip  lazy loading')
fs.writeFileSync('src/App.tsx', code)

let html = fs.readFileSync('index.html', 'utf8')
const big = await sharp('public/surprise-poster.png').resize({ width: 640 }).webp({ quality: 55 }).toBuffer()
const data = 'url(data:image/webp;base64,' + big.toString('base64') + ')'
const css = '#root:empty{position:fixed;inset:0;background:#090609 ' + data + ' center/cover no-repeat}html .poster-surprise{background:#090609 ' + data + ' center/cover no-repeat !important}'
const style = '<style id="lqip">' + css + '</style>'
if (/<style id="lqip">[\s\S]*?<\/style>/.test(html)) html = html.replace(/<style id="lqip">[\s\S]*?<\/style>/, () => style)
else html = html.replace('</head>', () => style + '</head>')
console.log('patched  opening picture inline (' + (big.length / 1024).toFixed(0) + ' KB)')
for (const f of ['golden-journey.webp', 'video-poster.webp']) {
  if (!html.includes('href="/' + f + '"')) {
    html = html.replace('</head>', '<link rel="preload" as="image" href="/' + f + '" type="image/webp" fetchpriority="low"/></head>')
    console.log('patched  preload ' + f)
  }
}
fs.writeFileSync('index.html', html)

console.log('DONE')
