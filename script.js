// Pointer / touch event helpers (iOS Safari < 13 fallback)
function onPointerMove(el, fn) {
  if (window.PointerEvent) {
    el.addEventListener('pointermove', fn, { passive: true });
  } else {
    el.addEventListener('touchmove', function (e) {
      fn({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    }, { passive: true });
  }
}
function onPointerLeave(el, fn) {
  if (window.PointerEvent) {
    el.addEventListener('pointerleave', fn);
  } else {
    el.addEventListener('touchend', fn);
    el.addEventListener('touchcancel', fn);
  }
}

const projectData = [
  {title:'Stories with a pulse.',kicker:'01 / Commercial & Social',desc:'Fast, intentional edits built for attention — from the first frame to the final CTA. This project represents my approach to rhythm, pacing, sound design and visual storytelling.',role:'Editing · Motion · Sound',type:'Video Production',file:'assets/PORTFOLIO/VIDEO 1.mp4'},
  {title:'Ideas, in motion.',kicker:'02 / Motion Graphics',desc:'Motion is used to make information easier to understand and give a brand a distinct visual language without overwhelming the message.',role:'Art Direction · Motion',type:'Motion Graphics',file:'assets/PORTFOLIO/VIDEO 2.mp4'},
  {title:'A visual identity that speaks.',kicker:'03 / Brand Campaign',desc:'A cohesive campaign system designed to work across social media, digital advertising and supporting brand communication.',role:'Design · Art Direction',type:'Graphic Design',file:'assets/PORTFOLIO/VIDEO 3.mp4'},
  {title:'From brief to final frame.',kicker:'04 / Production',desc:'The strongest edits start before the camera rolls. I help shape the idea, plan the visual language and carry that thinking through post-production.',role:'Pre · Production · Post',type:'Video Production',file:'assets/PORTFOLIO/VIDEO 4.mp4'},
  {title:'Designed for the feed.',kicker:'05 / Social Content',desc:'Short-form content that keeps the brand recognizable while adapting its visual language to fast-moving social platforms.',role:'Editing · Design · Motion',type:'Social Media',file:'assets/PORTFOLIO/VIDEO 5.mp4'},
  {title:'Detail makes the difference.',kicker:'06 / Visual Design',desc:'Graphic systems, layouts and campaign assets where typography, composition and hierarchy do the heavy lifting.',role:'Graphic Design · Layout',type:'Visual Design',file:'assets/PORTFOLIO/VIDEO 6.mp4'},
  {title:'One idea. Many formats.',kicker:'07 / Integrated Campaign',desc:'A complete creative system connecting video, motion and graphic design so every touchpoint feels like part of the same story.',role:'Creative Direction · Post',type:'Integrated Campaign',file:'assets/PORTFOLIO/VIDEO 7.mp4'}
];

const visualLayers = document.querySelector('#videoLayers');
const slideNo = document.querySelector('#activeSlide');

function makeLayer(index){
  const p=projectData[index];
  const layer=document.createElement('div');
  layer.className='video-layer';
  layer.dataset.index=index;
  layer.innerHTML=`<video muted playsinline loop preload="auto"><source src="${p.file}" type="video/mp4"></video><div class="video-fallback"><span class="fallback-no">${String(index+1).padStart(2,'0')}</span></div>`;
  visualLayers.appendChild(layer);
  const vid=layer.querySelector('video');
  vid.addEventListener('error',()=>{vid.style.display='none'});
  return layer;
}
projectData.forEach((_,i)=>makeLayer(i));
const layers=[...document.querySelectorAll('.video-layer')];

let soundOn=false;
let pendingFraction=null;
let scrubbing=false;
const seek=document.querySelector('#videoSeek');
const playBtn=document.querySelector('#playBtn');
function paintSeek(){const p=(seek.value/1000)*100;seek.style.background=`linear-gradient(90deg,#fff ${p}%,rgba(255,255,255,.28) ${p}%)`}
function activate(index){
  layers.forEach((l,i)=>{
    const active=i===index;
    l.classList.toggle('active',active);
    const v=l.querySelector('video');
    v.muted=!soundOn;
    if(active){v.play().catch(()=>{});if(!isFinite(v.duration)||!v.duration){try{v.load();}catch(e){}}}
    else {v.pause();}
  });
  slideNo.textContent=String(index+1).padStart(2,'0')+' / 07';
  if(!scrubbing){seek.value=0;paintSeek();playBtn.textContent='⏸︎';}
}
activate(0);

const muteBtn=document.querySelector('#muteBtn');
const fsBtn=document.querySelector('#fsBtn');
const activeVideo=()=>layers.find(l=>l.classList.contains('active'))?.querySelector('video')||null;
muteBtn.addEventListener('click',()=>{
  soundOn=!soundOn;
  layers.forEach(l=>{l.querySelector('video').muted=!soundOn;});
  muteBtn.classList.toggle('on',soundOn);
  const v=activeVideo();
  if(soundOn&&v&&v.paused){v.play().catch(()=>{});}
});
fsBtn.addEventListener('click',()=>{
  const stage=document.querySelector('#workVisual');
  const activeFs=document.fullscreenElement||document.webkitFullscreenElement;
  if(activeFs){
    if(document.exitFullscreen)document.exitFullscreen().catch(()=>{});
    else if(document.webkitExitFullscreen)document.webkitExitFullscreen();
    return;
  }
  if(stage.requestFullscreen){stage.requestFullscreen().catch(()=>{});}
  else if(stage.webkitRequestFullscreen){stage.webkitRequestFullscreen();}
});
const controlsBar=document.querySelector('.video-controls');
function alignControls(){
  const stage=document.querySelector('#workVisual');
  const v=activeVideo();
  if(window.innerWidth<=900||document.fullscreenElement===stage){stage.style.width='';stage.style.height='';stage.style.margin='';return;}
  if(!v||!v.videoWidth||!v.videoHeight)return;
  const CM=96/2.54,padX=CM,padTop=.61*CM,padBottom=.5*CM;
  const controlsRow=document.querySelector('.visual-overlay');
  const controlsH=(controlsRow?controlsRow.offsetHeight:0)+12;
  const wrap=stage.parentElement;
  const availW=wrap.clientWidth-padX*2,availH=wrap.clientHeight-padTop-padBottom-controlsH;
  if(availW<=0||availH<=0)return;
  const ar=v.videoWidth/v.videoHeight;
  let w=availW,h=w/ar;
  if(h>availH){h=availH;w=h*ar;}
  stage.style.width=(w+padX*2)+'px';
  stage.style.height=(h+padTop+padBottom+controlsH)+'px';
  stage.style.margin='0 auto';
}
window.addEventListener('resize',alignControls);
document.addEventListener('fullscreenchange',()=>{
  const stage=document.querySelector('#workVisual');
  if(document.fullscreenElement===stage){
    stage.style.width='';stage.style.height='';stage.style.margin='';
  }else{alignControls();}
});

let wasPlaying=false;
function setSectionPlayback(visible){
  const v=activeVideo();if(!v)return;
  if(!visible){
    wasPlaying=!v.paused&&!v.ended;
    if(!v.paused)v.pause();
    playBtn.textContent='▶︎';
  }else{
    if(wasPlaying){v.play().catch(()=>{});playBtn.textContent='⏸︎';}
  }
}
if(window.IntersectionObserver){
  new IntersectionObserver(entries=>{
    entries.forEach(e=>setSectionPlayback(e.isIntersecting));
  },{threshold:.05}).observe(document.querySelector('#work'));
}
document.addEventListener('visibilitychange',()=>{
  if(document.hidden)setSectionPlayback(false);
  else if(sectionInView)setSectionPlayback(true);
});
let sectionInView=true;
if(window.IntersectionObserver){
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{sectionInView=e.isIntersecting;});
  },{threshold:.05}).observe(document.querySelector('#work'));
}
layers.forEach(l=>{
  const v=l.querySelector('video');
  v.addEventListener('loadedmetadata',()=>{
    if(l.classList.contains('active')&&pendingFraction!=null&&isFinite(v.duration)){v.currentTime=pendingFraction*v.duration;pendingFraction=null;}
    if(l.classList.contains('active')&&isFinite(v.duration)){seek.value=(v.currentTime/v.duration)*1000;paintSeek();}
    if(l.classList.contains('active'))alignControls();
  });
  v.addEventListener('timeupdate',()=>{if(!scrubbing&&!v.seeking&&l.classList.contains('active')&&isFinite(v.duration)&&v.duration>0){seek.value=(v.currentTime/v.duration)*1000;paintSeek();}});
  v.addEventListener('seeked',()=>{if(l.classList.contains('active')&&isFinite(v.duration)){seek.value=(v.currentTime/v.duration)*1000;paintSeek();}});
  v.addEventListener('ended',()=>{v.loop=true;if(l.classList.contains('active'))playBtn.textContent='▶︎';});
  v.addEventListener('play',()=>{if(l.classList.contains('active'))playBtn.textContent='⏸︎';});
  v.addEventListener('pause',()=>{if(l.classList.contains('active'))playBtn.textContent='▶︎';});
});
playBtn.addEventListener('click',()=>{
  const v=activeVideo();if(!v)return;
  if(v.paused){v.play().catch(()=>{});}else{v.pause();}
});
window.addEventListener('pointerup',()=>{scrubbing=false});
window.addEventListener('touchend',()=>{scrubbing=false});
seek.addEventListener('change',()=>{
  scrubbing=false;
  const frac=seek.value/1000;
  const v=activeVideo();
  if(v&&isFinite(v.duration)&&v.duration>0){v.currentTime=frac*v.duration;paintSeek();}
});
seek.addEventListener('pointerdown',()=>{scrubbing=true});
seek.addEventListener('input',()=>{
  const frac=(seek.value/1000);
  const v=activeVideo();paintSeek();
  if(!v)return;
  if(frac>=.995&&v.loop)v.loop=false;
  if(isFinite(v.duration)&&v.duration>0){v.currentTime=frac*v.duration;}
  else{pendingFraction=frac;}
});

const slides=[...document.querySelectorAll('.work-slide')];
if(window.IntersectionObserver){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting) activate(Number(entry.target.dataset.index));});
  },{root:null,threshold:.55});
  slides.forEach(s=>observer.observe(s));
}

// FAQ accordion
const faqItems=[...document.querySelectorAll('.faq-item')];
faqItems.forEach(item=>{
  const btn=item.querySelector('.faq-button');
  const answer=item.querySelector('.faq-answer');
  if(item.classList.contains('open')){
    btn.setAttribute('aria-expanded','true');
    requestAnimationFrame(()=>{answer.style.height=answer.scrollHeight+'px';});
  }
  btn.addEventListener('click',()=>{
    const isOpen=item.classList.contains('open');
    faqItems.forEach(other=>{
      other.classList.remove('open');
      other.querySelector('.faq-answer').style.height='0px';
      other.querySelector('.faq-button').setAttribute('aria-expanded','false');
    });
    if(!isOpen){
      item.classList.add('open');
      answer.style.height=answer.scrollHeight+'px';
      btn.setAttribute('aria-expanded','true');
    }
  });
});

// Hybrid header behaviour:
//   Zone 1 (Hero): the shrink value scrubs LINEARLY with scroll position —
//     default at scrollY 0, fully compact the moment section two reaches the
//     top of the viewport, reversing identically on the way back up.
//   Zone 2 (everywhere else): pure scroll-DIRECTION trigger — down shrinks,
//     up expands — animated with a fast ease-out glide.
const header=document.querySelector('.site-header');
let headerRaf=0;
let headerTarget=0;
let headerCur=0;
let lastScrollY=window.scrollY;
let dirTarget=0;
let heroEnd=1;
let upOverride=false;
function heroCompactPoint(){
  const secs=[...document.querySelectorAll('main > section')];
  if(secs.length>1){
    const r=secs[1].getBoundingClientRect();
    heroEnd=Math.max(60,r.top+window.scrollY);
  }
}
function headerFrame(){
  headerRaf=0;
  if(window.innerWidth<=900){
    header.style.setProperty('--shrink','0');
    header.classList.remove('compact');
    return;
  }
  const diff=headerTarget-headerCur;
  if(Math.abs(diff)>.0008){
    headerCur+=diff*.13;
    headerRaf=requestAnimationFrame(headerFrame);
  }else{
    headerCur=headerTarget;
  }
  header.style.setProperty('--shrink',headerCur.toFixed(4));
  header.classList.toggle('compact',headerCur>.96);
}
function kickHeader(){if(!headerRaf)headerRaf=requestAnimationFrame(headerFrame);}
function measureNav(){
  const nav=header.querySelector('nav');
  if(!nav||window.innerWidth<=900)return;
  const prev=nav.style.maxWidth;
  nav.style.maxWidth='none';
  header.style.setProperty('--navw',(Math.ceil(nav.getBoundingClientRect().width)+2)+'px');
  nav.style.maxWidth=prev;
}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(()=>requestAnimationFrame(()=>{measureNav();heroCompactPoint();}));}
else{requestAnimationFrame(()=>{measureNav();heroCompactPoint();});}
window.addEventListener('resize',()=>{measureNav();heroCompactPoint();kickHeader();},{passive:true});
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  const delta=y-lastScrollY;
  lastScrollY=y;
  if(y<heroEnd){
    if(delta<-3){upOverride=true;}
    else if(delta>3&&y>0){upOverride=false;}
    headerTarget=(upOverride||y<=0)?0:Math.min(1,y/heroEnd);
  }else{
    if(delta>3)dirTarget=1;
    else if(delta<-3)dirTarget=0;
    headerTarget=dirTarget;
    if(delta>3)upOverride=false;
  }
  kickHeader();
},{passive:true});
heroCompactPoint();
if(window.scrollY>=heroEnd){dirTarget=1;headerCur=headerTarget=1;}
headerFrame();

// Fixed next-section button
const sections=[...document.querySelectorAll('main > section')];
const scrollBtn=document.querySelector('.scroll-next');
function currentSectionIndex(){
  const probe=window.scrollY+window.innerHeight*.5;
  let idx=0;
  sections.forEach((s,i)=>{if(s.offsetTop<=probe)idx=i;});
  return idx;
}
function syncScrollBtn(){
  if(!scrollBtn||!sections.length)return;
  const lastRect=sections[sections.length-1].getBoundingClientRect();
  scrollBtn.classList.toggle('up',lastRect.top<window.innerHeight*.6);
}
document.addEventListener('click',e=>{
  if(!e.target.closest('.scroll-next'))return;
  e.preventDefault();
  if(scrollBtn.classList.contains('up')){
    window.scrollTo({top:0,behavior:'smooth'});
    return;
  }
  const target=sections[Math.min(currentSectionIndex()+1,sections.length-1)];
  if(target)window.scrollTo({top:target.offsetTop,behavior:'smooth'});
});
syncScrollBtn();
window.addEventListener('scroll',syncScrollBtn,{passive:true});
window.addEventListener('resize',syncScrollBtn,{passive:true});

// Dock-style magnification across the whole header (logo, nav links, CTA)
const headerBar=document.querySelector('.site-header');
const navLinks=[...headerBar.querySelectorAll('nav a')];
const dockItems=[
  {el:headerBar.querySelector('.logo'),max:1.3,ox:'left bottom',lift:5},
  ...navLinks.map(a=>({el:a,max:1.4,ox:'center bottom',lift:7})),
  {el:headerBar.querySelector('.header-cta'),max:1.15,ox:'center bottom',lift:4}
].filter(d=>d.el);
const dockScale=dockItems.map(()=>1);
const dockTarget=dockItems.map(()=>1);
dockItems.forEach(d=>{d.el.style.transformOrigin=d.ox;d.w=d.el.offsetWidth;const cs=getComputedStyle(d.el);d.bml=parseFloat(cs.marginLeft)||0;d.bmr=parseFloat(cs.marginRight)||0;});
onPointerMove(headerBar, function(e){
  const R=95;
  dockItems.forEach((d,i)=>{
    const r=d.el.getBoundingClientRect();
    const dxc=e.clientX-(r.left+r.width/2),dyc=e.clientY-(r.top+r.height/2);
    const dist=Math.hypot(dxc,dyc*.6);
    dockTarget[i]=dist>=R?1:1+(d.max-1)*Math.pow(Math.cos(Math.min(dist/R,1)*Math.PI/2),2);
  });
});
onPointerLeave(headerBar, function(){dockTarget.fill(1)});
// Dock magnification — skip on touch-only devices to save battery
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
if(!isTouchDevice){
  (function dockLoop(){
    let growSum=0;
    dockItems.forEach((d,i)=>{
      dockScale[i]+=(dockTarget[i]-dockScale[i])*.28;
      const s=dockScale[i];
      d.el.style.transform=`translateY(${(-(s-1)*d.lift).toFixed(2)}px) scale(${s.toFixed(4)})`;
      const grow=(s-1)*d.w*1.5;
      if(d.el.closest('nav'))growSum+=grow*2;
      d.el.style.marginLeft=(d.bml+grow).toFixed(2)+'px';
      d.el.style.marginRight=(d.bmr+grow).toFixed(2)+'px';
    });
    headerBar.style.setProperty('--dockgrow',growSum.toFixed(1)+'px');
    requestAnimationFrame(dockLoop);
  })();
}

// Video section dips below the fixed navbar while scrolling up
const visWrap=document.querySelector('.work-visual-wrap');
let visLastY=window.scrollY;
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  const dirUp=y<visLastY;
  visLastY=y;
  if(visWrap)visWrap.classList.toggle('drop',dirUp&&y>10);
},{passive:true});

// Cursor
const dot=document.querySelector('.cursor-dot');
if(dot && window.matchMedia('(pointer:fine)').matches){
  onPointerMove(document.documentElement,function(e){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';});
}
