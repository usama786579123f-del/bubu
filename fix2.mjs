import fs from 'fs'
import sharp from 'sharp'

const kb = f => (fs.statSync(f).size / 1024).toFixed(0) + ' KB'

const jobs = [
  ['surprise-poster.png', 'surprise-poster.webp', 1080],
  ['golden-journey.png', 'golden-journey.webp', 1400],
  ['video-poster.png', 'video-poster.webp', 1280],
]
for (const [src, dst, w] of jobs) {
  if (!fs.existsSync('public/' + src)) { console.log('MISSING  public/' + src); continue }
  await sharp('public/' + src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile('public/' + dst)
  console.log('image ok ' + dst + '  ' + kb('public/' + src) + ' -> ' + kb('public/' + dst))
}

const srcWav = fs.existsSync('assets/bubu-birthday-wish.wav') ? 'assets/bubu-birthday-wish.wav' : 'public/bubu-birthday-wish.wav'
const buf = fs.readFileSync(srcWav)
let pos = 12, dataStart = -1, dataLen = 0, bits = 0
while (pos + 8 <= buf.length) {
  const id = buf.toString('ascii', pos, pos + 4), len = buf.readUInt32LE(pos + 4)
  if (id === 'fmt ') bits = buf.readUInt16LE(pos + 22)
  if (id === 'data') { dataStart = pos + 8; dataLen = Math.min(len, buf.length - dataStart); break }
  pos += 8 + len + (len % 2)
}
if (bits === 16 && dataStart > 0) {
  const GAIN = 2.6
  for (let i = dataStart; i + 1 < dataStart + dataLen; i += 2) {
    const x = buf.readInt16LE(i) / 32768
    buf.writeInt16LE(Math.round(Math.tanh(x * GAIN) * 0.97 * 32767), i)
  }
  fs.writeFileSync('public/bubu-birthday-wish.wav', buf)
  console.log('audio ok  wish awaaz loud ho gayi')
} else console.log('SKIP     wav format alag hai, loud nahi ki')

const file = 'src/App.tsx'
let code = fs.readFileSync(file, 'utf8')
const rep = (a, b, label) => {
  if (code.includes(a)) { code = code.split(a).join(b); console.log('patched  ' + label) }
  else console.log('already/NOT FOUND  ' + label)
}
rep('/surprise-poster.png', '/surprise-poster.webp', 'surprise image')
rep('/golden-journey.png', '/golden-journey.webp', 'golden image')
rep('/video-poster.png', '/video-poster.webp', 'video poster')
rep('[volume,setVolume]=useState(.58)', '[volume,setVolume]=useState(1)', 'volume default = full')
rep('<span>{muted?<VolumeX size={16}/>:<Volume2 size={16}/>} volume</span><input aria-label="Volume" type="range" min="0" max="1" step=".01" value={volume} onChange={e=>setVolume(Number(e.target.value))}/>', '', 'volume slider removed')
rep('wish.volume=muted?0:Math.max(.2,volume);crowd.volume=muted?0:.18*volume;', 'wish.volume=muted?0:1;wish.playbackRate=1.15;crowd.volume=muted?0:.12;', 'wish full volume + speed')
fs.writeFileSync(file, code)

let html = fs.readFileSync('index.html', 'utf8')
if (!html.includes('rel="preload" as="image"')) {
  html = html.replace('<meta charset="UTF-8"/>', '<meta charset="UTF-8"/><link rel="preload" as="image" href="/surprise-poster.webp" type="image/webp"/>')
  fs.writeFileSync('index.html', html)
  console.log('patched  preload added')
}
console.log('DONE')
