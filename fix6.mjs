import fs from 'fs'

const file = 'src/App.tsx'
let code = fs.readFileSync(file, 'utf8')
const start = code.indexOf('<section className="golden-showcase section-pad">')
if (start > 0) {
  const end = code.indexOf('</section>', start)
  code = code.slice(0, start) + code.slice(end + '</section>'.length)
  fs.writeFileSync(file, code)
  console.log('patched  "One room, every feeling" section removed')
} else console.log('already/skip  section already removed')

let html = fs.readFileSync('index.html', 'utf8')
html = html.replace(/<link rel="preload" as="image" href="\/golden-journey\.webp"[^>]*\/>/, '')
fs.writeFileSync('index.html', html)
console.log('DONE')
