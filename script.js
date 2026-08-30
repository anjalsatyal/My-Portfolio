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
const mobileSlideNo = document.querySelector('#mobileActiveSlide');

function makeLayer(index){
  const p=projectData[index];
  const layer=document.createElement('div');
  layer.className='video-layer';
  layer.dataset.index=index;
  layer.innerHTML=`<video muted playsinline loop preload="metadata" aria-label="Anjal Satyal ${p.type} project — ${p.title}"><source src="${p.file}" type="video/mp4"></video><div class="video-fallback"><span class="fallback-no">${String(index+1).padStart(2,'0')}</span></div>`;
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
function warmLayer(i){
  const l=layers[i];if(!l)return;
  const v=l.querySelector('video');
  if(v.readyState===0&&v.preload!=='auto'){v.preload='auto';try{v.load();}catch(e){}}
}
function activate(index){
  warmLayer(index);warmLayer(index-1);warmLayer(index+1);
  layers.forEach((l,i)=>{
    const active=i===index;
    l.classList.toggle('active',active);
    const v=l.querySelector('video');
    v.muted=!soundOn;
    if(active){v.play().catch(()=>{});}
    else {v.pause();}
  });
  const countText=String(index+1).padStart(2,'0')+' / 07';
  if(slideNo) slideNo.textContent=countText;
  if(mobileSlideNo) mobileSlideNo.textContent=countText;
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

// Auto-hide controls while a video is playing; reveal on hover/tap or when paused
const stageEl=document.querySelector('#workVisual');
let hideControlsTimer=null;
function showControls(){
  stageEl.classList.remove('controls-hidden');
  clearTimeout(hideControlsTimer);
  const v=activeVideo();
  if(v&&!v.paused){hideControlsTimer=setTimeout(()=>stageEl.classList.add('controls-hidden'),1800);}
}
stageEl.addEventListener('pointermove',showControls);
stageEl.addEventListener('pointerdown',showControls);
layers.forEach(l=>{
  const v=l.querySelector('video');
  v.addEventListener('play',()=>{if(l.classList.contains('active'))showControls();});
  v.addEventListener('pause',()=>{if(l.classList.contains('active')){clearTimeout(hideControlsTimer);stageEl.classList.remove('controls-hidden');}});
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

// ── Track real header height so CSS sticky top stays accurate ──────────────
const siteHeader=document.querySelector('.site-header');
function updateHeaderHeight(){
  if(siteHeader){
    const h=siteHeader.getBoundingClientRect().height+
             (parseInt(getComputedStyle(siteHeader).top)||0);
    document.documentElement.style.setProperty('--header-h',Math.round(h)+'px');
  }
}
updateHeaderHeight();
window.addEventListener('resize',updateHeaderHeight,{passive:true});

// ── Scroll-driven slide activation via IntersectionObserver ─────────────────
// On mobile: when a slide enters the viewport below the sticky video, it becomes active.
// On desktop: use the 55% threshold that already existed.
function getVisualWrapHeight(){
  return document.querySelector('.work-visual-wrap')?.offsetHeight||260;
}

let mobileObserver=null;
function setupMobileObserver(){
  if(mobileObserver){mobileObserver.disconnect();}
  if(window.innerWidth>900){return;}
  // rootMargin top = negative of header+video height so a slide is considered
  // "in view" only when it scrolls up past the bottom edge of the sticky block.
  const offset=-(getVisualWrapHeight()+16);
  mobileObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const idx=Number(entry.target.dataset.index);
      if(entry.isIntersecting){
        activate(idx);
        slides.forEach((s,i)=>s.classList.toggle('active-slide',i===idx));
      }
    });
  },{
    root:null,
    rootMargin:`${offset}px 0px -20% 0px`,
    threshold:0
  });
  slides.forEach(s=>mobileObserver.observe(s));
}

// Desktop IntersectionObserver (original behaviour)
if(window.IntersectionObserver){
  const desktopObserver=new IntersectionObserver(entries=>{
    if(window.innerWidth<=900)return;
    entries.forEach(entry=>{if(entry.isIntersecting) activate(Number(entry.target.dataset.index));});
  },{root:null,threshold:.55});
  slides.forEach(s=>desktopObserver.observe(s));
}

activate(0);
slides.forEach((s,i)=>s.classList.toggle('active-slide',i===0));
setupMobileObserver();
window.addEventListener('resize',setupMobileObserver,{passive:true});

// ── scrollToSlide: jump video and scroll page ───────────────────────────────
function scrollToSlide(idx){
  idx=Math.max(0,Math.min(slides.length-1,idx));
  activate(idx);
  slides.forEach((s,i)=>s.classList.toggle('active-slide',i===idx));
  if(slides[idx]){
    const isMobile=window.innerWidth<=900;
    const headerOffset=isMobile ? getVisualWrapHeight()+20 : 80;
    const targetY=slides[idx].getBoundingClientRect().top+window.scrollY-headerOffset;
    window.scrollTo({top:targetY,behavior:'smooth'});
  }
}

document.querySelector('#prevSlide')?.addEventListener('click',()=>{
  const cur=layers.findIndex(l=>l.classList.contains('active'));
  scrollToSlide(cur-1);
});
document.querySelector('#nextSlide')?.addEventListener('click',()=>{
  const cur=layers.findIndex(l=>l.classList.contains('active'));
  scrollToSlide(cur+1);
});
document.querySelector('#overlayPrevBtn')?.addEventListener('click',()=>{
  const cur=layers.findIndex(l=>l.classList.contains('active'));
  scrollToSlide(cur-1);
});
document.querySelector('#overlayNextBtn')?.addEventListener('click',()=>{
  const cur=layers.findIndex(l=>l.classList.contains('active'));
  scrollToSlide(cur+1);
});

// Fullscreen custom buttons logic
const fsBackBtn=document.querySelector('#fsBackBtn');
if(fsBackBtn){
  fsBackBtn.addEventListener('click',()=>{
    const exit=document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen;
    if(exit) exit.call(document);
  });
}
document.querySelector('#fsPrevBtn')?.addEventListener('click',()=>{
  const cur=layers.findIndex(l=>l.classList.contains('active'));
  scrollToSlide(cur-1);
});
document.querySelector('#fsNextBtn')?.addEventListener('click',()=>{
  const cur=layers.findIndex(l=>l.classList.contains('active'));
  scrollToSlide(cur+1);
});

// Big Play/Pause indicator logic
const bigPlayPause=document.querySelector('#bigPlayPause');
const bigPlayIcon=bigPlayPause?.querySelector('.icon');
function updateBigPlayPause(v){
  if(!bigPlayPause||!bigPlayIcon) return;
  if(v.paused){
    bigPlayIcon.textContent='▶︎';
    bigPlayPause.classList.add('show');
  }else{
    bigPlayIcon.textContent='⏸︎';
    bigPlayPause.classList.remove('show');
  }
}
layers.forEach(l=>{
  const v=l.querySelector('video');
  v.addEventListener('play',()=>{if(l.classList.contains('active')) updateBigPlayPause(v);});
  v.addEventListener('pause',()=>{if(l.classList.contains('active')) updateBigPlayPause(v);});
});

// Skip button — jump past all work slides to #services
document.querySelector('#workSkipBtn')?.addEventListener('click',e=>{
  e.preventDefault();
  const target=document.querySelector('#services');
  if(target) window.scrollTo({top:target.offsetTop,behavior:'smooth'});
});

// Mobile fullscreen button — makes the work-visual go fullscreen
const mobileFsBtn=document.querySelector('#mobileFs');
if(mobileFsBtn){
  const fsEl=document.querySelector('#workVisual');
  const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  function isFullscreen(){
    return !!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement)||fsEl?.classList.contains('ios-fs');
  }
  function enterFs(){
    if(isIOS){
      fsEl.classList.add('ios-fs');
      document.body.classList.add('ios-fs-lock');
      mobileFsBtn.textContent='✕';
      mobileFsBtn.setAttribute('aria-label','Exit fullscreen');
      return;
    }
    const req=fsEl.requestFullscreen||fsEl.webkitRequestFullscreen||fsEl.mozRequestFullScreen||fsEl.msRequestFullscreen;
    if(req) req.call(fsEl);
  }
  function exitFs(){
    if(isIOS){
      fsEl.classList.remove('ios-fs');
      document.body.classList.remove('ios-fs-lock');
      mobileFsBtn.textContent='⛶';
      mobileFsBtn.setAttribute('aria-label','Fullscreen');
      return;
    }
    const exit=document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen;
    if(exit) exit.call(document);
  }
  mobileFsBtn.addEventListener('click',()=>{
    if(!fsEl) return;
    if(isFullscreen()) exitFs(); else enterFs();
  });
  const onFsChange=()=>{
    if(isIOS) return;
    const fs=!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement);
    mobileFsBtn.textContent=fs?'✕':'⛶';
    mobileFsBtn.setAttribute('aria-label',fs?'Exit fullscreen':'Fullscreen');
  };
  document.addEventListener('fullscreenchange',onFsChange);
  document.addEventListener('webkitfullscreenchange',onFsChange);
}

// Touch swipe and center tap on video player for mobile
const workVis=document.querySelector('.work-visual');
let mobileControlsTimer=null;
function showMobileScrubber(){
  const ov=workVis?.querySelector('.visual-overlay');
  if(!ov || window.innerWidth > 900) return;
  ov.classList.add('mobile-show');
  clearTimeout(mobileControlsTimer);
  const v=activeVideo();
  if(v && !v.paused){
    mobileControlsTimer=setTimeout(()=>{
      ov.classList.remove('mobile-show');
    }, 2200);
  }
}

function hideMobileScrubber(){
  const ov=workVis?.querySelector('.visual-overlay');
  if(!ov || window.innerWidth > 900) return;
  clearTimeout(mobileControlsTimer);
  ov.classList.remove('mobile-show');
}

if(workVis){
  let touchStartX=0,touchStartY=0;
  workVis.addEventListener('touchstart',e=>{
    touchStartX=e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;
  },{passive:true});
  workVis.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-touchStartX;
    const dy=e.changedTouches[0].clientY-touchStartY;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){
      const cur=layers.findIndex(l=>l.classList.contains('active'));
      if(dx<0&&cur<slides.length-1) scrollToSlide(cur+1);
      else if(dx>0&&cur>0) scrollToSlide(cur-1);
    }else if(Math.abs(dx)<10&&Math.abs(dy)<10&&window.innerWidth<=900){
      // If user tapped on the seekbar itself, ignore play/pause toggle
      if(e.target.closest('.video-seek')) return;
      
      const v=activeVideo();
      if(v){
        if(v.paused){
          v.play().catch(()=>{});
          hideMobileScrubber();
        } else {
          v.pause();
          showMobileScrubber();
        }
      }
    }
  },{passive:true});
}

// Sync mobile scrubber with video play/pause events
layers.forEach(l=>{
  const v=l.querySelector('video');
  v.addEventListener('play',()=>{
    if(l.classList.contains('active') && window.innerWidth<=900){
      hideMobileScrubber();
    }
  });
  v.addEventListener('pause',()=>{
    if(l.classList.contains('active') && window.innerWidth<=900){
      showMobileScrubber();
    }
  });
});


// Mobile audio button — mirrors the desktop mute button state
const mobileAudioBtn=document.querySelector('#mobileAudioBtn');
if(mobileAudioBtn){
  mobileAudioBtn.addEventListener('click',()=>{
    soundOn=!soundOn;
    layers.forEach(l=>{l.querySelector('video').muted=!soundOn;});
    muteBtn.classList.toggle('on',soundOn);
    mobileAudioBtn.classList.toggle('on',soundOn);
    const v=activeVideo();
    if(soundOn&&v&&v.paused){v.play().catch(()=>{});}
  });
}
// Keep mobile audio button state in sync with desktop mute button
// (fire after the main click handler has toggled soundOn)
muteBtn.addEventListener('click',()=>{
  setTimeout(()=>{if(mobileAudioBtn) mobileAudioBtn.classList.toggle('on',soundOn);},0);
},{passive:true});


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
const visWrap=document.querySelector('.work-visual-wrap');
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
    // Allow --shrink to animate on mobile as well!
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
  if(window.innerWidth<=900){
    // On mobile, measure the CTA button so the shrink formula is exact
    const cta=header.querySelector('.header-cta');
    if(cta){
      const ctaRect=cta.getBoundingClientRect();
      // Include the header's left+right padding in the target width so nothing clips
      const hStyle=getComputedStyle(header);
      const pl=parseFloat(hStyle.paddingLeft)||18;
      const pr=parseFloat(hStyle.paddingRight)||10;
      header.style.setProperty('--ctaw',(Math.ceil(ctaRect.width)+pl+pr)+'px');
    }
    return;
  }
  const prev=nav?nav.style.maxWidth:null;
  if(nav){nav.style.maxWidth='none';}
  header.style.setProperty('--navw',(nav?Math.ceil(nav.getBoundingClientRect().width)+2:0)+'px');
  if(nav){nav.style.maxWidth=prev;}
}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(()=>requestAnimationFrame(()=>{measureNav();heroCompactPoint();}));}
else{requestAnimationFrame(()=>{measureNav();heroCompactPoint();});}
window.addEventListener('resize',()=>{
  if(window.innerWidth>900){
    header.classList.remove('mobile-shrunk');
  }
  measureNav();
  heroCompactPoint();
  kickHeader();
},{passive:true});

window.addEventListener('scroll',()=>{
  const rawY=window.scrollY;
  const y=Math.max(0, rawY);
  const delta=y-lastScrollY;
  lastScrollY=y;

  // Sticky video wrap detection for smooth fade-in
  if(visWrap){
    const wrapRect=visWrap.getBoundingClientRect();
    const isStuck = wrapRect.top <= (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 58) + 30;
    visWrap.classList.toggle('is-stuck', isStuck && y > 100);
    
    // Video section dips/resizes smoothly below navbar while scrolling up
    if (delta < -2 && y > 10) {
      visWrap.classList.add('drop');
    } else if (delta > 2 || y <= 10) {
      visWrap.classList.remove('drop');
    }
  }

  if(window.innerWidth<=900){
    // Mobile navbar: scrub --shrink exactly like desktop
    if(y < heroEnd){
      if(delta < -3){ upOverride = true; }
      else if(delta > 3 && y > 0){ upOverride = false; }
      headerTarget = (upOverride || y <= 0) ? 0 : Math.min(1, y / heroEnd);
    } else {
      if(delta > 3) dirTarget = 1;
      else if(delta < -3) dirTarget = 0;
      headerTarget = dirTarget;
      if(delta > 3) upOverride = false;
    }
    // Close nav if fully shrunk
    if(headerTarget >= 0.95 && header.classList.contains('nav-open')){
      header.classList.remove('nav-open');
      const navToggle=header.querySelector('.nav-toggle');
      if(navToggle) navToggle.setAttribute('aria-expanded','false');
    }
    kickHeader();
  }else{
    if(header.classList.contains('mobile-shrunk')){
      header.classList.remove('mobile-shrunk');
    }
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
  }
},{passive:true});
heroCompactPoint();
if(window.innerWidth<=900 && window.scrollY > heroEnd*.5){
  dirTarget=1; headerCur=headerTarget=1;
}else if(window.scrollY>=heroEnd){
  dirTarget=1;headerCur=headerTarget=1;
}
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

  const rect=scrollBtn.getBoundingClientRect();
  const btnCenterY=rect.top+rect.height/2;
  const btnCenterX=rect.left+rect.width/2;

  const darkEls=document.querySelectorAll('.dark-section, .site-footer, .reel-box, .work-video-box');
  let isDark=false;
  for(let i=0;i<darkEls.length;i++){
    const dRect=darkEls[i].getBoundingClientRect();
    if(
      btnCenterY>=dRect.top &&
      btnCenterY<=dRect.bottom &&
      btnCenterX>=dRect.left &&
      btnCenterX<=dRect.right
    ){
      isDark=true;
      break;
    }
  }

  scrollBtn.classList.toggle('is-dark-bg',isDark);
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

// "Let's talk" should always land at the very bottom of the page (contact + footer),
// not just the top of #contact — anchor-scroll alone only reaches the bottom when
// the viewport happens to be tall enough to clamp there.
document.querySelectorAll('a[href="#contact"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    window.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'});
  });
});

// Mobile nav dropdown
const headerBar=document.querySelector('.site-header');
const navToggle=headerBar.querySelector('.nav-toggle');
const mobileNav=headerBar.querySelector('nav');
function closeMobileNav(){
  if(!headerBar.classList.contains('nav-open'))return;
  if(mobileNav){
    mobileNav.classList.add('is-closing');
    let done=false;
    function finishClose(){
      if(done)return;
      done=true;
      mobileNav.classList.remove('is-closing');
      headerBar.classList.remove('nav-open');
      navToggle&&navToggle.setAttribute('aria-expanded','false');
    }
    mobileNav.addEventListener('animationend',finishClose,{once:true});
    // Fallback: force-close after 350ms in case animationend doesn't fire (iOS Safari)
    setTimeout(finishClose,350);
  } else {
    headerBar.classList.remove('nav-open');
    navToggle&&navToggle.setAttribute('aria-expanded','false');
  }
}
if(navToggle){
  navToggle.addEventListener('click',()=>{
    if(headerBar.classList.contains('nav-open')){
      closeMobileNav();
    } else {
      headerBar.classList.add('nav-open');
      navToggle.setAttribute('aria-expanded','true');
    }
  });
  headerBar.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{
    closeMobileNav();
  }));
}


// Dock-style magnification across the whole header (logo, nav links, CTA)
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

// Cursor
const dot=document.querySelector('.cursor-dot');
if(dot && window.matchMedia('(pointer:fine)').matches){
  onPointerMove(document.documentElement,function(e){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';});
}

// ── Reel section: click to play/pause ──────────────────────────────────────
const reelBox=document.querySelector('#reelBox');
const reelVideo=document.querySelector('#reelVideo');
const reelIndicator=document.querySelector('#reelPlayIndicator');
const reelIcon=reelIndicator?.querySelector('.icon');
let reelIndicatorTimer=null;

function showReelIndicator(){
  if(!reelIndicator||!reelIcon) return;
  reelIcon.textContent=reelVideo.paused?'▶︎':'⏸︎';
  reelIndicator.classList.add('show');
  clearTimeout(reelIndicatorTimer);
  // auto-hide after 1.5s if playing
  if(!reelVideo.paused){
    reelIndicatorTimer=setTimeout(()=>reelIndicator.classList.remove('show'),1500);
  }
}

if(reelBox && reelVideo){
  reelBox.addEventListener('click',e=>{
    // ignore clicks on any child controls if any
    if(reelVideo.paused){
      reelVideo.play().catch(()=>{});
    } else {
      reelVideo.pause();
    }
    showReelIndicator();
  });
  reelVideo.addEventListener('pause',()=>{
    if(reelIcon) reelIcon.textContent='▶︎';
    if(reelIndicator) reelIndicator.classList.add('show');
    clearTimeout(reelIndicatorTimer);
  });
  reelVideo.addEventListener('play',()=>{
    showReelIndicator();
  });
}

// ── Desktop work section: click on video to play/pause ─────────────────────
// Only on desktop (pointer:fine). Mobile already has touch tap handler.
if(window.matchMedia('(pointer:fine)').matches && stageEl){
  stageEl.addEventListener('click',e=>{
    // Ignore clicks on controls (buttons, seek bar)
    if(e.target.closest('.visual-ctrl,.video-seek,#playBtn,#muteBtn,#fsBtn,#overlayPrevBtn,#overlayNextBtn')) return;
    const v=activeVideo();
    if(!v) return;
    if(v.paused){ v.play().catch(()=>{}); } else { v.pause(); }
    // show the big play/pause indicator
    updateBigPlayPause(v);
    const bpp=document.querySelector('#bigPlayPause');
    if(bpp){
      bpp.classList.add('show');
      clearTimeout(window._bppTimer);
      if(!v.paused) window._bppTimer=setTimeout(()=>bpp.classList.remove('show'),1200);
    }
  });
}

// ── Scroll-triggered entrance animations ───────────────────────
(function(){
  document.documentElement.classList.add('anim-ready');
  const animEls=document.querySelectorAll('.reel .section-label,.reel .reel-box,.work .section-label,.work .work-intro,.work-slide,.services .section-label,.services .service-row,.about .section-label,.about .about-grid h2,.about .about-copy p,.about .stats,.about .text-link,.faq .faq-head .section-label,.faq .faq-head h2,.faq .faq-head p,.faq .faq-item,.contact .section-label,.contact h2,.contact .email-link,.site-footer .footer-brand,.site-footer .footer-availability,.site-footer .footer-nav a,.site-footer .footer-bottom');
  if(!animEls.length) return;
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('vis');
      else e.target.classList.remove('vis');
    });
  },{threshold:0.01});
  animEls.forEach(el=>io.observe(el));
})();

// ── Stat counter animation ─────────────────────────────────────
(function(){
  const counters=document.querySelectorAll('.stat strong[data-count]');
  if(!counters.length) return;
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const el=e.target;
      if(!e.isIntersecting){
        el.classList.remove('counting');
        el.textContent='0';
        return;
      }
      el.classList.add('counting');
      const target=parseInt(el.dataset.count,10);
      const duration=1800;
      const start=performance.now();
      function tick(now){
        const elapsed=now-start;
        const progress=Math.min(elapsed/duration,1);
        const ease=1-Math.pow(1-progress,3);
        const current=Math.round(target*ease);
        el.textContent=current+'+';
        if(progress<1) requestAnimationFrame(tick);
        else el.classList.remove('counting');
      }
      requestAnimationFrame(tick);
    });
  },{threshold:0.5});
  counters.forEach(el=>io.observe(el));
})();

// ── CTA pulse: pause on scroll up, resume on scroll down, pause at contact ──
(function(){
  const header=document.querySelector('.site-header');
  if(!header) return;
  let lastY=window.scrollY;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    const delta=y-lastY;
    lastY=y;
    const ctaBtn=header.querySelector('.header-cta');
    if(!ctaBtn) return;
    const contactSection=document.getElementById('contact');
    const contactInView=contactSection&&contactSection.getBoundingClientRect().top<window.innerHeight*0.8;
    if(contactInView||delta<-1){
      ctaBtn.classList.add('paused');
    }else if(delta>1){
      ctaBtn.classList.remove('paused');
    }
  },{passive:true});
})();

// ── Hero replay: re-trigger entrance animation on scroll back to top ─────
(function(){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  document.body.classList.add('hero-replay');
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        document.body.classList.remove('hero-replay');
        void document.body.offsetHeight;
        document.body.classList.add('hero-replay');
      }else{
        document.body.classList.remove('hero-replay');
      }
    });
  },{threshold:0.3});
  io.observe(hero);
})();

// ── Email Compose Widget: DISABLED ─────────────────────────────
// All email widget code commented out. Button uses plain mailto: link.
