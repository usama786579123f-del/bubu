import fs from 'fs'

fs.mkdirSync('public', { recursive: true })
for (const f of ['bubu-birthday-wish.wav', 'birthday-crowd-loop.mp3']) {
  if (fs.existsSync('assets/' + f)) {
    fs.copyFileSync('assets/' + f, 'public/' + f)
    console.log('copied  -> public/' + f)
  } else if (!fs.existsSync('public/' + f)) {
    console.log('MISSING -> ' + f)
  }
}

const file = 'src/App.tsx'
let code = fs.readFileSync(file, 'utf8')
const map = [
  [/\/manus-storage\/long_distance_birthday_cartoon_[\w]+\.mp4/g, '/bubu-video.mp4'],
  [/\/manus-storage\/bubu-birthday-wish_[\w]+\.wav/g, '/bubu-birthday-wish.wav'],
  [/\/manus-storage\/birthday-crowd-loop_[\w]+\.mp3/g, '/birthday-crowd-loop.mp3'],
  [/\/manus-storage\/MagicalBirthdaySurpriseforBubu_[\w]+\.png/g, '/surprise-poster.png'],
  [/\/manus-storage\/GoldenBirthdayJourneyforBubu_[\w]+\.png/g, '/golden-journey.png'],
]
for (const [re, to] of map) code = code.replace(re, to)

if (!code.includes('poster="/video-poster.png"')) {
  code = code.replace('src={VIDEO_PATH} controls', 'src={VIDEO_PATH} poster="/video-poster.png" controls')
}
fs.writeFileSync(file, code)
console.log('App.tsx paths updated')

for (const f of ['surprise-poster.png', 'golden-journey.png', 'video-poster.png']) {
  console.log((fs.existsSync('public/' + f) ? 'OK       ' : 'MISSING  ') + 'public/' + f)
}
if (!fs.existsSync('public/bubu-video.mp4')) console.log('NOTE     public/bubu-video.mp4 abhi nahi hai (baad mein)')
