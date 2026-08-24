const projectData = [
  {title:'Stories with a pulse.',kicker:'01 / Commercial & Social',desc:'Fast, intentional edits built for attention — from the first frame to the final CTA. This project represents my approach to rhythm, pacing, sound design and visual storytelling.',role:'Editing · Motion · Sound',type:'Video Production',file:'assets/videos/video-01.mp4'},
  {title:'Ideas, in motion.',kicker:'02 / Motion Graphics',desc:'Motion is used to make information easier to understand and give a brand a distinct visual language without overwhelming the message.',role:'Art Direction · Motion',type:'Motion Graphics',file:'assets/videos/video-02.mp4'},
  {title:'A visual identity that speaks.',kicker:'03 / Brand Campaign',desc:'A cohesive campaign system designed to work across social media, digital advertising and supporting brand communication.',role:'Design · Art Direction',type:'Graphic Design',file:'assets/videos/video-03.mp4'},
  {title:'From brief to final frame.',kicker:'04 / Production',desc:'The strongest edits start before the camera rolls. I help shape the idea, plan the visual language and carry that thinking through post-production.',role:'Pre · Production · Post',type:'Video Production',file:'assets/videos/video-04.mp4'},
  {title:'Designed for the feed.',kicker:'05 / Social Content',desc:'Short-form content that keeps the brand recognizable while adapting its visual language to fast-moving social platforms.',role:'Editing · Design · Motion',type:'Social Media',file:'assets/videos/video-05.mp4'},
  {title:'Detail makes the difference.',kicker:'06 / Visual Design',desc:'Graphic systems, layouts and campaign assets where typography, composition and hierarchy do the heavy lifting.',role:'Graphic Design · Layout',type:'Visual Design',file:'assets/videos/video-06.mp4'},
  {title:'One idea. Many formats.',kicker:'07 / Integrated Campaign',desc:'A complete creative system connecting video, motion and graphic design so every touchpoint feels like part of the same story.',role:'Creative Direction · Post',type:'Integrated Campaign',file:'assets/videos/video-07.mp4'}
];

const visualLayers = document.querySelector('#videoLayers');
const slideNo = document.querySelector('#activeSlide');

function makeLayer(index){
  const p=projectData[index];
  const layer=document.createElement('div');
  layer.className='video-layer';
  layer.dataset.index=index;
  layer.innerHTML=`<video muted playsinline loop preload="metadata"><source src="${p.file}" type="video/mp4"></video><div class="video-fallback"><span class="fallback-no">${String(index+1).padStart(2,'0')}</span></div>`;
  visualLayers.appendChild(layer);
  const vid=layer.querySelector('video');
  vid.addEventListener('error',()=>{vid.style.display='none'});
  return layer;
}
projectData.forEach((_,i)=>makeLayer(i));
const layers=[...document.querySelectorAll('.video-layer')];

function activate(index){
  layers.forEach((l,i)=>{
    const active=i===index;
    l.classList.toggle('active',active);
    const v=l.querySelector('video');
    if(active){v.play().catch(()=>{});}
    else {v.pause();}
  });
  slideNo.textContent=String(index+1).padStart(2,'0')+' / 07';
}
activate(0);

const slides=[...document.querySelectorAll('.work-slide')];
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting) activate(Number(entry.target.dataset.index));});
},{root:null,threshold:.55});
slides.forEach(s=>observer.observe(s));

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

// Scroll-linked header: the compact state is driven directly by page scroll,
// so the transition follows the user's scroll velocity instead of running on
// a fixed-duration animation. Scrolling back up reveals the original header.
const header=document.querySelector('.site-header');
let headerRaf=0;
let lastScrollY=window.scrollY;
function updateHeader(){
  headerRaf=0;
  if(window.innerWidth<=900){
    header.style.setProperty('--shrink','0');
    header.classList.remove('compact');
    return;
  }
  const start=28;
  const distance=Math.max(260,window.innerHeight-140);
  const progress=Math.max(0,Math.min(1,(window.scrollY-start)/distance));
  header.style.setProperty('--shrink',progress.toFixed(4));
  header.classList.toggle('compact', progress > .96);
}
window.addEventListener('scroll',()=>{
  const currentScrollY=window.scrollY;
  const scrollingUp=currentScrollY<lastScrollY;
  lastScrollY=currentScrollY;
  if(scrollingUp){
    if(headerRaf) cancelAnimationFrame(headerRaf);
    headerRaf=0;
    header.style.setProperty('--shrink','0');
    header.classList.remove('compact');
    return;
  }
  if(!headerRaf) headerRaf=requestAnimationFrame(updateHeader);
},{passive:true});
window.addEventListener('resize',()=>{
  if(!headerRaf) headerRaf=requestAnimationFrame(updateHeader);
},{passive:true});
updateHeader();

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

// Cursor
const dot=document.querySelector('.cursor-dot');
window.addEventListener('pointermove',e=>{if(dot){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';}});
