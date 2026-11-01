import fs from 'fs'
import path from 'path'
import os from 'os'
import sharp from 'sharp'

const [cakeIn, journeyIn] = process.argv.slice(2)
if (!cakeIn && !journeyIn) {
  const dir = path.join(os.homedir(), 'Downloads')
  const files = (fs.existsSync(dir) ? fs.readdirSync(dir) : []).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).map(f => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs })).sort((a, b) => b.t - a.t).slice(0, 10)
  console.log('Downloads ki sab se nayi images:')
  files.forEach(x => console.log('  ' + path.join(dir, x.f)))
  console.log('Phir chalao:  node pics.mjs "<cake image>" "<journey image>"')
  console.log('Sirf ek badalni ho to doosri ki jagah - likho, jaise:  node pics.mjs "<cake image>" -')
  process.exit(0)
}

const stamp = Date.now().toString(36)
let code = fs.readFileSync('src/App.tsx', 'utf8')
let html = fs.readFileSync('index.html', 'utf8')
async function swap(input, base, width, srcRe, hrefRe) {
  if (!input || input === '-') return
  if (!fs.existsSync(input)) { console.log('NAHI MILI  ' + input); return }
  const name = base + '-' + stamp + '.webp'
  await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 76 }).toFile('public/' + name)
  let n = 0
  code = code.replace(srcRe, () => { n++; return 'src="/' + name + '"' })
  html = html.replace(hrefRe, () => 'href="/' + name + '"')
  console.log((n ? 'patched  ' : 'NOT FOUND  ') + base + ' -> ' + name)
}
await swap(cakeIn, 'cake', 1100, /src="\/cake[\w-]*\.webp"/g, /href="\/cake[\w-]*\.webp"/g)
await swap(journeyIn, 'journey', 1400, /src="\/(?:golden-journey|journey)[\w-]*\.webp"/g, /href="\/(?:golden-journey|journey)[\w-]*\.webp"/g)
fs.writeFileSync('src/App.tsx', code)
fs.writeFileSync('index.html', html)
console.log('DONE')
