import fs from 'fs'
import sharp from 'sharp'

if (!fs.existsSync('public/cake.webp')) {
  const src = ['public/video-poster.webp', 'public/video-poster.png', 'public/surprise-poster.png'].find(f => fs.existsSync(f))
  if (src) { await sharp(src).resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 76 }).toFile('public/cake.webp'); console.log('image ok  temporary public/cake.webp') }
}
let code = fs.readFileSync('src/App.tsx', 'utf8')
const vid = /<video ref=\{videoRef\}[^>]*\/>/
if (vid.test(code)) { code = code.replace(vid, () => '<img className="hero-cake" src="/cake.webp" alt="Birthday cake for Bubu" decoding="async"/>'); console.log('patched  nakli video hata di, picture lag gayi') }
else console.log('already/skip  hero video')
code = code.split('<span>Live from our shared room</span><span className="recording-pill"><i/> replayable</span>').join('<span>A cake, just for you</span><span className="recording-pill"><i/> fresh baked</span>')
fs.writeFileSync('src/App.tsx', code)

const css = `
/* luxe */
html{scroll-behavior:smooth}
::selection{background:#e4ba7b;color:#1b1418}
.hero-cake{display:block;width:100%;height:auto;max-height:680px;object-fit:cover;background:#372229}
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9990;background:radial-gradient(ellipse at 50% 40%,transparent 55%,rgba(0,0,0,.5))}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:9991;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")}
h1,h2,h3{text-wrap:balance;letter-spacing:-.015em}
h1 em,h2 em,h3 em{font-style:italic;background:linear-gradient(100deg,#a8742f 0%,#f6dfa5 30%,#e4ba7b 50%,#fff3cf 70%,#b8863f 100%);background-size:220% auto;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;animation:luxfoil 8s linear infinite}
@keyframes luxfoil{to{background-position:220% center}}
.button-gold,.poster-open{position:relative;overflow:hidden;background:linear-gradient(135deg,#f0d29a,#c9964a)!important;box-shadow:0 12px 34px rgba(228,186,123,.28),inset 0 1px 0 rgba(255,255,255,.5);transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s}
.button-gold:hover,.poster-open:hover{transform:translateY(-3px);box-shadow:0 18px 44px rgba(228,186,123,.42),inset 0 1px 0 rgba(255,255,255,.6)}
.button-gold:after,.poster-open:after{content:'';position:absolute;top:0;left:-70%;width:45%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:luxshine 4.5s ease-in-out infinite}
@keyframes luxshine{0%,55%{left:-70%}100%{left:130%}}
.poster-open{animation:luxpulse 2.8s ease-in-out infinite}
@keyframes luxpulse{50%{box-shadow:0 14px 50px rgba(228,186,123,.55),inset 0 1px 0 rgba(255,255,255,.5)}}
.video-frame,.voice-card,.track-card,.soundboard,.golden-showcase-frame{backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-color:rgba(228,186,123,.42)!important;box-shadow:0 26px 80px rgba(0,0,0,.45),0 0 60px rgba(228,186,123,.1),inset 0 1px 0 rgba(255,242,222,.12)!important}
.video-frame{animation:luxfloat 9s ease-in-out infinite}
@keyframes luxfloat{50%{transform:translateY(-8px)}}
.video-frame img,.golden-showcase-frame img{transition:transform 1.2s cubic-bezier(.22,1,.36,1)}
.video-frame:hover img{transform:scale(1.03)}
button{transition:transform .25s cubic-bezier(.22,1,.36,1),filter .25s}
button:active{transform:scale(.97)}
:focus-visible{outline:2px solid #e4ba7b;outline-offset:3px}
header{backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
.rv{opacity:0;transform:translateY(38px);transition:opacity 1s cubic-bezier(.22,1,.36,1),transform 1s cubic-bezier(.22,1,.36,1)}
.rv.rv-in{opacity:1;transform:none}
#luxbar{position:fixed;top:0;left:0;right:0;height:2px;z-index:10000;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,#a8742f,#f6dfa5,#e4ba7b);box-shadow:0 0 12px rgba(228,186,123,.8)}
#luxdust{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}
::-webkit-scrollbar{width:9px}::-webkit-scrollbar-track{background:#120c0f}::-webkit-scrollbar-thumb{background:linear-gradient(#e4ba7b,#9b5c66);border-radius:9px}
@media (prefers-reduced-motion:reduce){.rv{opacity:1;transform:none}.video-frame,.poster-open,h1 em,h2 em,h3 em,.button-gold:after,.poster-open:after{animation:none}html{scroll-behavior:auto}}
`
let c = fs.readFileSync('src/index.css', 'utf8')
if (!c.includes('/* luxe */')) { fs.writeFileSync('src/index.css', c + '\n' + css); console.log('patched  luxury CSS') } else console.log('already/skip  luxury CSS')

const js = `<script id="luxe">
(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function init(){
var bar=document.createElement('div');bar.id='luxbar';document.body.appendChild(bar);
function prog(){var h=document.documentElement;bar.style.transform='scaleX('+Math.min(1,Math.max(0,h.scrollTop/((h.scrollHeight-h.clientHeight)||1)))+')'}
addEventListener('scroll',prog,{passive:true});prog();
if(!reduce&&'IntersectionObserver' in window){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('rv-in');io.unobserve(e.target)}})},{threshold:.1});
var seen=new WeakSet();
var scan=function(){document.querySelectorAll('#root section').forEach(function(s){if(seen.has(s))return;seen.add(s);if(s.getBoundingClientRect().top<innerHeight*.85)return;s.classList.add('rv');io.observe(s)})};
setInterval(scan,900);scan();
}
if(!reduce){
var c=document.createElement('canvas');c.id='luxdust';document.body.appendChild(c);
var x=c.getContext('2d'),W,H,P=[];
var rs=function(){W=c.width=innerWidth;H=c.height=innerHeight};rs();addEventListener('resize',rs);
for(var i=0;i<(innerWidth<600?22:42);i++)P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.4,v:Math.random()*.25+.08,a:Math.random()*.5+.15,s:Math.random()*6});
(function loop(t){x.clearRect(0,0,W,H);for(var k=0;k<P.length;k++){var p=P[k];p.y-=p.v;p.x+=Math.sin(t/2000+p.s)*.15;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}x.beginPath();x.fillStyle='rgba(240,200,140,'+(p.a*(.6+.4*Math.sin(t/700+p.s)))+')';x.arc(p.x,p.y,p.r,0,6.283);x.fill()}requestAnimationFrame(loop)})(0);
}
}
if(document.body)init();else addEventListener('DOMContentLoaded',init);
})();
</script>`
let html = fs.readFileSync('index.html', 'utf8')
if (!html.includes('id="luxe"')) { html = html.replace('</body>', () => js + '</body>'); fs.writeFileSync('index.html', html); console.log('patched  luxury JS') } else console.log('already/skip  luxury JS')
console.log('DONE')
