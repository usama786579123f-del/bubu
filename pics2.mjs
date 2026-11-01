import fs from 'fs'
import path from 'path'
import os from 'os'
import sharp from 'sharp'

const IMG = /\.(png|jpe?g|webp)$/i
const dirs = [path.join(os.homedir(), 'Downloads'), process.cwd()]
function find(re) {
  let best = null
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue
    for (const f of fs.readdirSync(d)) {
      if (!IMG.test(f) || !re.test(f)) continue
      const full = path.join(d, f), t = fs.statSync(full).mtimeMs
      if (!best || t > best.t) best = { full, t }
    }
  }
  return best && best.full
}
const cakeIn = find(/cake/i)
const journeyIn = find(/^journey/i)
console.log('cake image    : ' + (cakeIn || 'NAHI MILI (Downloads mein naam mein "cake" likha ho)'))
console.log('journey image : ' + (journeyIn || 'NAHI MILI (naam "journey..." se shuru ho)'))

const stamp = Date.now().toString(36)
let code = fs.readFileSync('src/App.tsx', 'utf8')
let html = fs.readFileSync('index.html', 'utf8')

if (!code.includes('golden-showcase section-pad')) {
  const section = '<section className="golden-showcase section-pad"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> A golden birthday journey <span className="eyebrow-line"/></div><h3>One room.<br/><em>Every feeling.</em></h3></div><p>Yeh Bubu ke liye poori birthday journey ka cinematic moodboard hai. Neeche cake, hug, letters, memories aur voice message live interact karte hain.</p></div><div className="golden-showcase-frame"><img src="/journey.webp" alt="Birthday journey for Bubu" loading="eager" decoding="async"/><div className="golden-showcase-caption"><span>Usama \u2661 Bubu \u00b7 distance is just a number</span><button className="button button-gold" onClick={()=>document.getElementById(\'cake\')?.scrollIntoView({behavior:\'smooth\'})}>Enter the live ceremony <ArrowDown size={16}/></button></div></div></section>\n '
  const anchor = '<section id="cake" className="section-pad ceremony-section">'
  if (code.includes(anchor)) { code = code.replace(anchor, () => section + anchor); console.log('patched  "One room, every feeling" section wapas lag gayi') }
  else console.log('NOT FOUND  cake section anchor')
}

async function swap(input, base, width, srcRe) {
  if (!input) return
  const name = base + '-' + stamp + '.webp'
  await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 76 }).toFile('public/' + name)
  let n = 0
  code = code.replace(srcRe, () => { n++; return 'src="/' + name + '"' })
  console.log((n ? 'patched  ' : 'NOT FOUND  ') + base + ' -> ' + name)
}
await swap(cakeIn, 'cake', 1100, /src="\/cake[\w-]*\.webp"/g)
await swap(journeyIn, 'journey', 1400, /src="\/(?:golden-journey|journey)[\w-]*\.webp"/g)
fs.writeFileSync('src/App.tsx', code)
fs.writeFileSync('index.html', html)
console.log('DONE')
