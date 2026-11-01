import fs from 'fs'
import sharp from 'sharp'

const input = process.argv[2] || 'public/journey.png'
if (!fs.existsSync(input)) {
  console.log('Image nahi mili: ' + input)
  console.log('Ya to usay public/journey.png naam se rakho, ya path do:  node fix7.mjs "C:\\...\\image.png"')
  process.exit(0)
}
await sharp(input).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 76 }).toFile('public/journey.webp')
console.log('image ok  public/journey.webp  ' + (fs.statSync('public/journey.webp').size / 1024).toFixed(0) + ' KB')

let code = fs.readFileSync('src/App.tsx', 'utf8')
const oldImg = 'src="/golden-journey.webp" alt="Golden Birthday Journey for Bubu"'
if (code.includes(oldImg)) {
  code = code.replace(oldImg, 'src="/journey.webp" alt="Birthday journey for Bubu"')
  fs.writeFileSync('src/App.tsx', code)
  console.log('patched  section ki picture badal gayi')
} else if (code.includes('src="/journey.webp"')) {
  console.log('already  picture pehle se journey.webp hai (nayi image file update ho gayi)')
} else {
  console.log('NOT FOUND  "One room, every feeling" section nahi mila. Shayad hata di gayi hai, mujhe batao.')
}

let html = fs.readFileSync('index.html', 'utf8')
if (html.includes('href="/golden-journey.webp"')) {
  html = html.replace('href="/golden-journey.webp"', 'href="/journey.webp"')
  fs.writeFileSync('index.html', html)
  console.log('patched  preload')
}
console.log('DONE')
