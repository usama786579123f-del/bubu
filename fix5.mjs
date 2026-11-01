import fs from 'fs'
import path from 'path'
import os from 'os'
import sharp from 'sharp'

const input = process.argv[2]
if (input) {
  await sharp(input).rotate().resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 76 }).toFile('public/cake.webp')
  console.log('image ok  public/cake.webp  ' + (fs.statSync('public/cake.webp').size / 1024).toFixed(0) + ' KB')
} else if (!fs.existsSync('public/cake.webp')) {
  const dir = path.join(os.homedir(), 'Downloads')
  const files = (fs.existsSync(dir) ? fs.readdirSync(dir) : []).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).map(f => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs })).sort((a, b) => b.t - a.t).slice(0, 8)
  console.log('Cake wali image ka path chahiye. Downloads ki sab se nayi images:')
  files.forEach(x => console.log('  ' + path.join(dir, x.f)))
  console.log('Phir dobara chalao:  node fix5.mjs "<cake image ka poora path>"')
  process.exit(0)
}

const file = 'src/App.tsx'
let code = fs.readFileSync(file, 'utf8')
const rep = (a, b, label) => {
  if (code.includes(a)) { code = code.split(a).join(b); console.log('patched  ' + label) }
  else console.log('already/skip  ' + label)
}
rep('<video ref={videoRef} className="hero-video" src={VIDEO_PATH} poster="/video-poster.webp" controls playsInline preload="metadata"/>',
    '<img className="hero-cake" src="/cake.webp" alt="Birthday cake for Bubu" decoding="async"/>', 'video -> cake picture')
rep('<span>Live from our shared room</span><span className="recording-pill"><i/> replayable</span>',
    '<span>A cake, just for you</span><span className="recording-pill"><i/> fresh baked</span>', 'cake label')

if (!code.includes('function VoiceNotePlayer')) {
  const player = `function VoiceNotePlayer(){
  const ref=useRef<HTMLAudioElement|null>(null)
  const [playing,setPlaying]=useState(false),[t,setT]=useState(0),[d,setD]=useState(0)
  const fmt=(s:number)=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')
  const toggle=()=>{const a=ref.current;if(!a)return;if(a.paused){document.querySelectorAll('audio').forEach(x=>{if(x!==a)x.pause()});void a.play().catch(()=>undefined)}else a.pause()}
  return <div className="voice-console"><audio ref={ref} src="/voice-note.mp3" preload="auto" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onTimeUpdate={e=>setT(e.currentTarget.currentTime)} onLoadedMetadata={e=>setD(e.currentTarget.duration)}/><div className="waveform">{Array.from({length:32}).map((_,i)=><i key={i} style={{height:(18+(i*17)%50)+'%'}} className={playing?'wave-live':''}/>)}</div><div className="voice-controls"><button className="record-main" onClick={toggle}><span>{playing?<Pause size={18}/>:<Play size={18}/>}</span>{playing?'Pause':'Play my voice'}</button><small className="voice-time">{fmt(t)} / {fmt(d)}</small></div></div>
}

`
  const i = code.indexOf('export default function App')
  if (i > 0) { code = code.slice(0, i) + player + code.slice(i); console.log('patched  voice player added') }
  else console.log('NOT FOUND  App component')
} else console.log('already/skip  voice player added')

const s1 = code.indexOf('<div className="voice-console"><div className="waveform">')
const endMark = '{voiceUrl&&<audio controls src={voiceUrl}/>}</div></div>'
const s2 = code.indexOf(endMark)
if (s1 > 0 && s2 > s1) { code = code.slice(0, s1) + '<VoiceNotePlayer/>' + code.slice(s2 + endMark.length); console.log('patched  recorder removed, player placed') }
else console.log('already/skip  recorder removed')
const re = /<p>Ye optional personal voice-note[\s\S]*?<\/p><div className="voice-meta">[\s\S]*?<\/div>/
if (re.test(code)) { code = code.replace(re, () => '<p>Ye Usama ki apni awaaz mein, sirf tumhare liye ek chhota sa message hai. Headphones laga ke sunna.</p>'); console.log('patched  voice text') }
else console.log('already/skip  voice text')
fs.writeFileSync(file, code)

let css = fs.readFileSync('src/index.css', 'utf8')
if (!css.includes('/* hero-cake */')) {
  css += '\n/* hero-cake */\n.hero-cake{display:block;width:100%;height:auto;max-height:680px;object-fit:cover;background:#372229}\n.voice-time{display:block;margin-top:10px;color:#f29ca9;letter-spacing:.08em}\n'
  fs.writeFileSync('src/index.css', css)
  console.log('patched  css')
}

let html = fs.readFileSync('index.html', 'utf8')
html = html.replace(/<link rel="preload" as="image" href="\/video-poster\.webp"[^>]*\/>/, '')
if (!html.includes('href="/cake.webp"')) html = html.replace('</head>', '<link rel="preload" as="image" href="/cake.webp" type="image/webp" fetchpriority="low"/></head>')
fs.writeFileSync('index.html', html)
console.log('DONE')
