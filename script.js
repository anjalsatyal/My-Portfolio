const projects=[{title:"Stories that connect",category:"Video Production",number:"01",role:"Ideation · Scripting · Shooting · Editing · Color Grading · Sound Design · Text",format:"Commercial & Social",file:"assets/PORTFOLIO/VIDEO 1.mp4",context:"A real-life story of Dhiraj Chhetri, from a BBS student to a DG Academy learner and eventually a full-time graphic designer.",process:"The piece follows the journey, struggles, learning and choices that shaped his path, with production and post handled as one continuous storytelling system."},{title:"Motion & Visual Storytelling",category:"Motion Graphics",number:"02",role:"Art Direction · Motion Graphics · Sound Design · Editing",format:"SaaS Campaigns",file:"assets/PORTFOLIO/VIDEO 2.mp4",context:"Motion used to simplify complex information and make ideas easier to understand.",process:"The visual language is kept focused so animation supports the message instead of overwhelming it."},{title:"Designed for the feed",category:"Social Content",number:"03",role:"Ideation · Script · Shoot · Editing",format:"Short-form · Social Media",file:"assets/PORTFOLIO/VIDEO 5.mp4",context:"The first video for Think Move Solution (TMS), created to introduce the agency, strengthen brand awareness and attract potential clients.",process:"From concept and scripting to production and post, the work shaped a visual language designed to stand out on fast-moving social platforms."},{title:"From idea to a full campaign",category:"Motion Graphics",number:"04",role:"Art Direction · Motion Graphics · Sound Design · Editing",format:"SaaS Campaigns",file:"assets/PORTFOLIO/VIDEO 6.mp4",context:"A motion graphics video recreated and refined into a clean, polished visual system. Animation, sound and editing work together to create a cohesive social-first piece.",process:"Art Direction · Motion Graphics · Sound Design · Editing"},{title:"Motion Graphics",category:"Integrated Campaign",number:"05",role:"Motion Design · Animation · Sound Design · Editing",format:"Motion Graphics · Social Media",file:"assets/PORTFOLIO/VIDEO 7.mp4",context:"A motion graphics video recreated and refined into a clean, polished visual system.",process:"Animation, sound and editing work together to create a cohesive social-first piece."}];
const prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header=document.querySelector(".site-header"),menuToggle=document.querySelector(".menu-toggle"),mobileMenu=document.querySelector(".mobile-menu"),cursor=document.querySelector(".cursor");
function setMenu(open){document.body.classList.toggle("menu-open",open);mobileMenu?.classList.toggle("open",open);mobileMenu?.setAttribute("aria-hidden",String(!open));mobileMenu?.toggleAttribute("inert",!open);menuToggle?.setAttribute("aria-expanded",String(open));menuToggle?.setAttribute("aria-label",open?"Close menu":"Open menu")}
menuToggle?.addEventListener("click",()=>setMenu(!document.body.classList.contains("menu-open")));mobileMenu?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>setMenu(false)));
document.querySelectorAll('a[href="#contact"]').forEach(link=>link.addEventListener("click",event=>{event.preventDefault();setMenu(false);if(location.hash!=="#contact")history.pushState(null,"","#contact");requestAnimationFrame(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:prefersReducedMotion?"auto":"smooth"}))}));
window.addEventListener("keydown",event=>{if(event.key==="Escape"&&document.body.classList.contains("menu-open"))setMenu(false)});
function onScroll(){header?.classList.toggle("scrolled",window.scrollY>80)}onScroll();window.addEventListener("scroll",onScroll,{passive:true});
const siteNav=document.querySelector(".site-nav"),navLinks=[...siteNav?.querySelectorAll("a")||[]];
if(siteNav&&navLinks.length){
  const finePointer=window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktop=window.matchMedia("(min-width: 901px)");
  const dockItems=[header.querySelector(".brand"),...navLinks,header.querySelector(".availability")].filter(Boolean);
  const amplitudes=dockItems.map(item=>item.matches(".brand") ? .22 : item.matches(".availability") ? .16 : .8);
  const scales=dockItems.map(()=>1);
  let widths=[],dockFrame=0,pointerX=0,hovering=false,lastTime=0;
  function measureDock(){
    widths=dockItems.map(link=>link.closest(".site-nav")?link.querySelector("span").offsetWidth:link.offsetWidth);
  }
  measureDock();
  document.fonts.ready.then(measureDock);
  function startDock(){
    if(!dockFrame){lastTime=performance.now();dockFrame=requestAnimationFrame(paintDock)}
  }
  function resetDock(){
    hovering=false;
    startDock();
  }
  function paintDock(now){
    dockFrame=0;
    const enabled=finePointer.matches&&!reducedMotion.matches&&desktop.matches;
    const linkCenters=dockItems.map(link=>{const bounds=link.getBoundingClientRect();return bounds.left+bounds.width/2});
    // Map the pointer into item space so the crest stays beneath it as items spread.
    let segment=0;
    while(segment<linkCenters.length-2&&pointerX>linkCenters[segment+1])segment++;
    const pointerPosition=segment+(pointerX-linkCenters[segment])/Math.max(1,linkCenters[segment+1]-linkCenters[segment]);
    let growth=0,moving=false;
    const blend=enabled?1-Math.exp(-Math.min(now-lastTime,64)/(hovering?65:100)):1;
    lastTime=now;
    dockItems.forEach((link,index)=>{
      const distance=Math.abs(pointerPosition-index);
      const influence=hovering&&enabled?(1+Math.cos(Math.PI*Math.min(distance/2.15,1)))/2:0;
      const target=1+amplitudes[index]*Math.pow(influence,1.6);
      scales[index]+=(target-scales[index])*blend;
      if(Math.abs(target-scales[index])<.0005)scales[index]=target;
      else moving=true;
      const extra=widths[index]*(scales[index]-1);
      link.style.setProperty("--dock-scale",scales[index].toFixed(4));
      link.style.setProperty("--dock-lift",`${(-6.325*(scales[index]-1)/.8).toFixed(3)}px`);
      link.style.setProperty("--dock-space",`${(extra/2).toFixed(3)}px`);
      growth+=extra;
    });
    header?.style.setProperty("--dock-growth",`${growth.toFixed(3)}px`);
    if(moving)dockFrame=requestAnimationFrame(paintDock);
  }
  header.addEventListener("pointermove",event=>{
    if(event.pointerType!=="mouse"||!finePointer.matches||reducedMotion.matches||!desktop.matches||header.querySelector(":focus-visible"))return;
    pointerX=event.clientX;
    hovering=true;
    startDock();
  },{passive:true});
  header.addEventListener("pointerleave",resetDock);
  header.addEventListener("focusin",resetDock);
  finePointer.addEventListener("change",resetDock);
  reducedMotion.addEventListener("change",resetDock);
  desktop.addEventListener("change",resetDock);
  window.addEventListener("resize",()=>{measureDock();resetDock()});

  const sections=navLinks.map(link=>({link,section:document.querySelector(link.getAttribute("href"))}));
  function syncActiveSection(){
    const position=window.scrollY+Math.min(window.innerHeight*.35,220);
    let active=null,activeTop=-1;
    sections.forEach(item=>{
      if(item.section&&item.section.offsetTop<=position&&item.section.offsetTop>activeTop){
        active=item.link;activeTop=item.section.offsetTop;
      }
    });
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-2)active=navLinks[navLinks.length-1];
    navLinks.forEach(link=>{
      if(link===active)link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
  }
  syncActiveSection();
  window.addEventListener("scroll",syncActiveSection,{passive:true});
  window.addEventListener("resize",syncActiveSection);
}
if(cursor&&window.matchMedia("(pointer:fine)").matches){window.addEventListener("pointermove",event=>{cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`},{passive:true})}
const revealObserver="IntersectionObserver"in window&&!prefersReducedMotion?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("in-view");revealObserver.unobserve(entry.target)}})},{threshold:.15}):null;
if (revealObserver) {
  document.querySelectorAll(".footer-contact,.footer-toolkit,.footer-bottom").forEach(element => {
    element.classList.add("footer-reveal");
    revealObserver.observe(element);
  });
}
document.querySelectorAll(".section-head,.project-panel,.featured-copy,.featured-card,.motion-grid,.service-row,.about,.about-copy,.about-media,.training,.archive-link,.archive-intro,.archive-stat,.archive-tabs,.archive-card,.faq-item,.contact .overline,.contact h2,.contact p,.email-link,.stats div,.final-frame").forEach(el=>{if(revealObserver)revealObserver.observe(el);else el.classList.add("in-view")});
const aboutPortrait=document.querySelector("[data-about-parallax]");
function paintAboutParallax(){if(!aboutPortrait||prefersReducedMotion)return;const rect=aboutPortrait.getBoundingClientRect(),center=rect.top+rect.height/2-window.innerHeight/2,offset=Math.max(-18,Math.min(18,center*-0.035));aboutPortrait.style.setProperty("--about-parallax",`${offset}px`)}
paintAboutParallax();window.addEventListener("scroll",paintAboutParallax,{passive:true});window.addEventListener("resize",paintAboutParallax);
const reelVideo=document.querySelector("#reelVideo"),reelStage=document.querySelector(".reel-stage"),reelShell=document.querySelector(".reel-shell"),reelPlay=document.querySelector("#reelPlay"),reelMute=document.querySelector("#reelMute"),reelFullscreen=document.querySelector("#reelFullscreen"),reelTimeline=document.querySelector("#reelTimeline");
let isReelScrubbing=false,hasPlayedUnmuted=false,lastScrollY=window.scrollY;
function paintReelSeek(){if(!reelTimeline)return;const p=(Number(reelTimeline.value)||0)/10;reelTimeline.style.setProperty("--seek",`${p}%`);}
function syncReelSeek(){if(!reelTimeline||!reelVideo||isReelScrubbing||!Number.isFinite(reelVideo.duration)||reelVideo.duration<=0)return;reelTimeline.value=Math.round((reelVideo.currentTime/reelVideo.duration)*1000);paintReelSeek();}
function seekReel(){if(!reelTimeline||!reelVideo)return;const t=(Number(reelTimeline.value)||0)/1000;if(Number.isFinite(reelVideo.duration)&&reelVideo.duration>0){reelVideo.currentTime=t*reelVideo.duration;}paintReelSeek();}
reelTimeline?.addEventListener("pointerdown",()=>{isReelScrubbing=true;});
reelTimeline?.addEventListener("input",seekReel);
reelTimeline?.addEventListener("change",()=>{seekReel();isReelScrubbing=false;});
window.addEventListener("pointerup",()=>{if(isReelScrubbing){seekReel();isReelScrubbing=false;}});
reelVideo?.addEventListener("timeupdate",syncReelSeek);
reelVideo?.addEventListener("loadedmetadata",syncReelSeek);
paintReelSeek();
function syncReel(){if(!reelVideo||!reelStage||!reelPlay)return;reelStage.classList.toggle("playing",!reelVideo.paused);reelPlay.querySelector("span").textContent=reelVideo.paused?"Play":"Pause";reelPlay.setAttribute("aria-label",reelVideo.paused?"Play showreel":"Pause showreel");if(reelMute){const label=reelVideo.muted?"Turn showreel sound on":"Turn showreel sound off";reelMute.setAttribute("aria-label",label);reelMute.setAttribute("title",label);reelMute.setAttribute("aria-pressed",String(!reelVideo.muted));reelMute.querySelector("use").setAttribute("href",reelVideo.muted?"#icon-volume-off":"#icon-volume-on")}}
reelPlay?.addEventListener("click",()=>{if(reelVideo.paused){reelVideo.play().catch(()=>{});reelStage.classList.remove("show-controls");}else{reelVideo.pause();reelStage.classList.add("show-controls");}syncReel();});
reelStage?.addEventListener("click",event=>{if(event.target.closest("button, input"))return;if(reelVideo.paused){reelVideo.play().catch(()=>{});reelStage.classList.remove("show-controls");}else{reelVideo.pause();reelStage.classList.add("show-controls");}});
reelVideo?.addEventListener("play",syncReel);
reelVideo?.addEventListener("pause",syncReel);
reelMute?.addEventListener("click",()=>{reelVideo.muted=!reelVideo.muted;syncReel();if(!reelVideo.paused)reelVideo.play().catch(()=>{});});
reelFullscreen?.addEventListener("click",()=>{if(!reelShell)return;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else reelShell.requestFullscreen?.().catch(()=>{});});
document.addEventListener("fullscreenchange",()=>{if(!reelFullscreen)return;const expanded=document.fullscreenElement===reelShell;reelFullscreen.setAttribute("aria-label",expanded?"Exit showreel fullscreen":"Open showreel fullscreen");reelFullscreen.setAttribute("title",expanded?"Exit fullscreen":"Fullscreen");reelFullscreen.querySelector("use").setAttribute("href",expanded?"#icon-exit-fullscreen":"#icon-fullscreen")});
syncReel();
if("IntersectionObserver" in window){
  const showreelObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const isScrollingDown = window.scrollY > lastScrollY;
      if(entry.isIntersecting){
        // Entering
        if(isScrollingDown && !hasPlayedUnmuted){
          // Scroll from hero (top) to showreel: autoplay video + audio enabled
          reelVideo.muted=false;
          reelVideo.play().catch(()=>{
            reelVideo.muted=true;
            reelVideo.play().catch(()=>{});
          });
          hasPlayedUnmuted=true;
        }else{
          // Scroll up or returning: autoplay video + audio off
          reelVideo.muted=true;
          if(reelVideo.paused) reelVideo.play().catch(()=>{});
        }
      }else{
        // Leaving: auto pause and turn audio off
        reelVideo.pause();
        reelVideo.muted=true;
      }
      syncReel();
    });
  },{threshold:0.4});
  if(reelStage)showreelObserver.observe(reelStage);
}
window.addEventListener("scroll", () => { lastScrollY = window.scrollY; }, {passive: true});
const projectLayers=document.querySelector("#projectLayers"),projectCounter=document.querySelector("#projectCounter"),projectSeek=document.querySelector("#projectSeek"),projectPanels=[...document.querySelectorAll(".project-panel")];let activeProject=0,projectSound=false,isProjectScrubbing=false;
projects.forEach((project,index)=>{const layer=document.createElement("div");layer.className="project-layer";layer.dataset.index=index;layer.innerHTML=`<video muted playsinline loop preload="${index===0?"metadata":"none"}"><source src="${project.file}" type="video/mp4"></video>`;projectLayers?.appendChild(layer)});
const layers=[...document.querySelectorAll(".project-layer")],activeVideo=()=>layers[activeProject]?.querySelector("video");
function paintProjectSeek(){if(!projectSeek)return;const progress=(Number(projectSeek.value)||0)/10;projectSeek.style.setProperty("--seek",`${progress}%`)}
function syncProjectSeek(){const video=activeVideo();if(!projectSeek||!video||isProjectScrubbing||!Number.isFinite(video.duration)||video.duration<=0)return;projectSeek.value=Math.round((video.currentTime/video.duration)*1000);paintProjectSeek()}
function seekActiveProject(){const video=activeVideo();if(!projectSeek||!video)return;const target=(Number(projectSeek.value)||0)/1000;if(Number.isFinite(video.duration)&&video.duration>0){video.currentTime=target*video.duration}paintProjectSeek()}
function activateProject(index,scroll=false){activeProject=Math.max(0,Math.min(projects.length-1,index));layers.forEach((layer,layerIndex)=>{const video=layer.querySelector("video"),active=layerIndex===activeProject;layer.classList.toggle("active",active);video.muted=!projectSound;if(active){video.preload="metadata";video.play().catch(()=>{});setTimeout(syncProjectSeek,80)}else{video.pause();if(Math.abs(layerIndex-activeProject)>1)video.preload="none"}});projectPanels.forEach((panel,panelIndex)=>panel.classList.toggle("active",panelIndex===activeProject));if(projectCounter)projectCounter.textContent=`${String(activeProject+1).padStart(2,"0")} / ${String(projects.length).padStart(2,"0")}`;if(projectSeek){projectSeek.value=0;paintProjectSeek()}if(scroll)projectPanels[activeProject]?.scrollIntoView({behavior:prefersReducedMotion?"auto":"smooth",block:"center"})}
activateProject(0);
if("IntersectionObserver"in window){const projectObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)activateProject(Number(entry.target.dataset.project))})},{threshold:.52});projectPanels.forEach(panel=>projectObserver.observe(panel))}
layers.forEach(layer=>{const video=layer.querySelector("video");video.addEventListener("timeupdate",()=>{if(layer.classList.contains("active"))syncProjectSeek()});video.addEventListener("loadedmetadata",()=>{if(layer.classList.contains("active"))syncProjectSeek()});video.addEventListener("play",()=>{if(layer.classList.contains("active"))document.querySelector("#projectToggle").textContent="Pause"});video.addEventListener("pause",()=>{if(layer.classList.contains("active"))document.querySelector("#projectToggle").textContent="Play"})});
projectSeek?.addEventListener("pointerdown",()=>{isProjectScrubbing=true});
projectSeek?.addEventListener("input",seekActiveProject);
projectSeek?.addEventListener("change",()=>{seekActiveProject();isProjectScrubbing=false});
window.addEventListener("pointerup",()=>{if(isProjectScrubbing){seekActiveProject();isProjectScrubbing=false}});
paintProjectSeek();
document.querySelector("#projectPrev")?.addEventListener("click",()=>activateProject(activeProject-1,true));document.querySelector("#projectNext")?.addEventListener("click",()=>activateProject(activeProject+1,true));document.querySelector("#projectToggle")?.addEventListener("click",event=>{const video=activeVideo();if(!video)return;if(video.paused)video.play().catch(()=>{});else video.pause();event.currentTarget.textContent=video.paused?"Play":"Pause"});document.querySelector("#projectMute")?.addEventListener("click",event=>{projectSound=!projectSound;layers.forEach(layer=>layer.querySelector("video").muted=!projectSound);event.currentTarget.textContent=projectSound?"Sound on":"Sound off";activeVideo()?.play().catch(()=>{})});document.querySelector(".project-media")?.addEventListener("click",event=>{if(event.target.closest("button,input"))return;document.querySelector("#projectToggle")?.click()});
const lazyVideos=[...document.querySelectorAll(".featured-card video,.motion video,.archive-preview,.final-frame video")];if("IntersectionObserver"in window){const videoObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{const video=entry.target;if(video.closest(".featured-card")&&window.matchMedia("(max-width: 900px)").matches)return;if(entry.isIntersecting){video.preload="metadata";if(video.closest(".featured-card")&&!video.closest(".featured-card.active"))return;video.play().catch(()=>{})}else video.pause()})},{threshold:.12});lazyVideos.forEach(video=>videoObserver.observe(video))}
const statObserver="IntersectionObserver"in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting||entry.target.dataset.done)return;entry.target.dataset.done="true";const target=Number(entry.target.dataset.count),start=performance.now(),duration=1500;function tick(now){const progress=Math.min((now-start)/duration,1),eased=1-Math.pow(1-progress,3);entry.target.textContent=`${Math.round(target*eased)}+`;if(progress<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)})},{threshold:.6}):null;document.querySelectorAll("[data-count]").forEach(el=>{if(el.closest(".archive-card")||el.closest(".archive-stat"))return;if(statObserver)statObserver.observe(el);else el.textContent=`${el.dataset.count}+`});
function buildArchiveSlider(number){const raw=String(number.dataset.count||number.textContent.trim()),hasPlus=raw.includes("+")||number.textContent.includes("+"),clean=raw.replace(/[^\d,]/g,"");let digitIdx=0;const rows=digit=>[0,1,2,3,4,5,6,7,8,9,digit].map(row=>`<span>${row}</span>`).join("");number.innerHTML=[...clean].map(ch=>{if(ch===",")return '<span class="digit-separator">,</span>';const idx=digitIdx++;return `<span class="digit-window" data-digit="${ch}" style="--digit-idx:${idx}"><span class="digit-track">${rows(ch)}</span></span>`}).join("")+(hasPlus?'<span class="count-plus">+</span>':'')}
document.querySelectorAll(":is(.archive-card, .archive-stat) [data-count]").forEach(buildArchiveSlider);
const archiveRollCards=[...document.querySelectorAll(".archive-stat, .archive-card")];
function rollAllArchiveCounts(){archiveRollCards.forEach(card=>{card.classList.remove("is-rolling");void card.offsetWidth;card.classList.add("is-rolling");clearTimeout(Number(card.dataset.rollTimer)||0);card.dataset.rollTimer=setTimeout(()=>card.classList.remove("is-rolling"),1400)})}
if("IntersectionObserver"in window){const archiveScrollObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)rollAllArchiveCounts()})},{threshold:.22});const archiveSec=document.querySelector("#archive");if(archiveSec)archiveScrollObserver.observe(archiveSec)}
document.querySelectorAll("[data-archive-roll]").forEach(tab=>{const type=tab.dataset.archiveRoll,card=document.querySelector(`[data-archive-card="${type}"]`);["mouseenter","focus"].forEach(eventName=>tab.addEventListener(eventName,()=>{if(!card)return;card.classList.remove("is-rolling");void card.offsetWidth;card.classList.add("is-rolling");clearTimeout(Number(card.dataset.rollTimer)||0);card.dataset.rollTimer=setTimeout(()=>card.classList.remove("is-rolling"),1400)}))});
document.querySelectorAll(".faq-item").forEach(item=>{const button=item.querySelector("button"),answer=item.querySelector(".faq-answer");if(item.classList.contains("open")&&answer)answer.style.height=`${answer.scrollHeight}px`;button?.addEventListener("click",()=>{const open=item.classList.contains("open");document.querySelectorAll(".faq-item").forEach(other=>{other.classList.remove("open");other.querySelector("button")?.setAttribute("aria-expanded","false");const otherAnswer=other.querySelector(".faq-answer");if(otherAnswer)otherAnswer.style.height="0px"});if(!open&&answer){item.classList.add("open");button.setAttribute("aria-expanded","true");answer.style.height=`${answer.scrollHeight}px`}})});
const dialog=document.querySelector("#caseDialog"),caseBody=dialog?.querySelector(".case-body"),closeCase=dialog?.querySelector(".case-close");
function caseTemplate(project,index){const next=projects[(index+1)%projects.length];return `<section class="case-hero"><video src="${project.file}" muted playsinline loop autoplay></video><div class="case-title"><p>Project ${project.number} / ${project.category}</p><h2>${project.title}</h2></div></section><section class="case-content"><dl><div><dt>Role</dt><dd>${project.role}</dd></div><div><dt>Format</dt><dd>${project.format}</dd></div><div><dt>Media</dt><dd>Existing portfolio video asset</dd></div></dl><div><h3>Context</h3><p>${project.context}</p><h3>Creative process</h3><p>${project.process}</p><h3>Production, editing and motion</h3><p>The available project information points to an end-to-end creative role: shaping the idea, preparing the message, building the visuals, editing the rhythm, refining sound and color, and delivering a social-ready final output.</p></div></section><div class="case-next"><button class="case-link" type="button" data-open-case="${(index+1)%projects.length}">Next project: ${next.title} ↗</button></div>`}
function openCase(index){if(!dialog||!caseBody)return;const project=projects[index];caseBody.innerHTML=caseTemplate(project,index);document.body.classList.add("case-open");if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");history.replaceState(null,"",`#project-${project.number}`)}
function closeCaseDialog(){if(!dialog)return;document.body.classList.remove("case-open");if(dialog.open&&typeof dialog.close==="function")dialog.close();else dialog.removeAttribute("open");if(location.hash.startsWith("#project-"))history.replaceState(null,"","#work")}
document.addEventListener("click",event=>{const opener=event.target.closest("[data-open-case]");if(!opener)return;openCase(Number(opener.dataset.openCase))});closeCase?.addEventListener("click",closeCaseDialog);dialog?.addEventListener("click",event=>{if(event.target===dialog)closeCaseDialog()});window.addEventListener("keydown",event=>{if(event.key==="Escape"&&dialog?.open)closeCaseDialog()});
const hashMatch=location.hash.match(/^#project-(\d+)/);if(hashMatch){const index=Math.max(0,Math.min(projects.length-1,Number(hashMatch[1])-1));requestAnimationFrame(()=>openCase(index))}

const featuredCards=[...document.querySelectorAll(".featured-card")],featuredCopy=document.querySelector(".featured-copy"),featuredNumber=document.querySelector("#featuredNumber"),featuredCategory=document.querySelector("#featuredCategory"),featuredTitle=document.querySelector("#featuredTitle"),featuredDesc=document.querySelector("#featuredDesc"),featuredRole=document.querySelector("#featuredRole"),featuredFormat=document.querySelector("#featuredFormat"),featuredCase=document.querySelector("#featuredCase");
const featuredRail=document.querySelector("#featuredRail"),featuredMobile=window.matchMedia("(max-width: 900px)");
let featuredIndex=0,featuredTimer=0,featuredSound=false,featuredFlashTimer=0,featuredScrubbing=false;
let featuredRailVisible=false,featuredScrollFrame=0;
function syncFeaturedVolume(){featuredCards.forEach(card=>{const button=card.querySelector(".featured-volume"),video=card.querySelector("video");if(video)video.muted=!featuredSound;if(button){const label=featuredSound?"Turn sound off":"Turn sound on";button.setAttribute("aria-label",label);button.setAttribute("title",label);button.setAttribute("aria-pressed",String(featuredSound));button.querySelector("use").setAttribute("href",featuredSound?"#icon-volume-on":"#icon-volume-off")}})}
function flashFeatured(card,playing){const flash=card?.querySelector(".featured-flash");if(!flash)return;flash.textContent=playing?"Ⅱ":"▶";flash.classList.remove("show");void flash.offsetWidth;flash.classList.add("show");clearTimeout(featuredFlashTimer);featuredFlashTimer=setTimeout(()=>flash.classList.remove("show"),680)}
function paintFeaturedSeek(seek){if(!seek)return;const progress=(Number(seek.value)||0)/10;seek.style.setProperty("--seek",`${progress}%`)}
function syncFeaturedSeek(card){const video=card?.querySelector("video"),seek=card?.querySelector(".featured-seek");if(!video||!seek||featuredScrubbing||!Number.isFinite(video.duration)||video.duration<=0)return;seek.value=Math.round((video.currentTime/video.duration)*1000);paintFeaturedSeek(seek)}
function seekFeaturedVideo(card){const video=card?.querySelector("video"),seek=card?.querySelector(".featured-seek");if(!video||!seek)return;const fraction=(Number(seek.value)||0)/1000;if(Number.isFinite(video.duration)&&video.duration>0)video.currentTime=fraction*video.duration;paintFeaturedSeek(seek)}
function paintFeaturedProject(index){const project=projects[index];if(!project)return;featuredCards.forEach((card,cardIndex)=>{const active=cardIndex===index,video=card.querySelector("video");card.classList.toggle("active",active);card.setAttribute("aria-pressed",String(active));if(video)video.muted=!featuredSound;if(active){video&&(video.preload="metadata");if(!featuredMobile.matches||featuredRailVisible)video?.play().catch(()=>{})}else{video?.pause()}});syncFeaturedVolume();if(featuredNumber)featuredNumber.textContent=`Project ${project.number}`;if(featuredCategory)featuredCategory.textContent=project.category;if(featuredTitle)featuredTitle.textContent=project.title;if(featuredDesc)featuredDesc.textContent=project.context+" "+project.process;if(featuredRole)featuredRole.textContent=project.role;if(featuredFormat)featuredFormat.textContent=project.format;if(featuredCase)featuredCase.dataset.openCase=String(index)}
function setFeaturedProject(index){if(index===featuredIndex)return;featuredIndex=index;clearTimeout(featuredTimer);if(featuredMobile.matches){paintFeaturedProject(index);featuredCopy?.classList.remove("is-switching");return}featuredCopy?.classList.add("is-switching");featuredTimer=setTimeout(()=>{paintFeaturedProject(index);requestAnimationFrame(()=>featuredCopy?.classList.remove("is-switching"))},230)}
function syncFeaturedRail(){if(!featuredMobile.matches||!featuredRail)return;const rail=featuredRail.getBoundingClientRect(),center=rail.left+rail.width/2;let nearest=featuredIndex,distance=Infinity;featuredCards.forEach((card,index)=>{const rect=card.getBoundingClientRect(),nextDistance=Math.abs(rect.left+rect.width/2-center);if(nextDistance<distance){distance=nextDistance;nearest=index}});setFeaturedProject(nearest)}
featuredRail?.addEventListener("scroll",()=>{if(featuredScrollFrame)cancelAnimationFrame(featuredScrollFrame);featuredScrollFrame=requestAnimationFrame(()=>{featuredScrollFrame=0;syncFeaturedRail()})},{passive:true});
if(featuredRail&&"IntersectionObserver"in window){const featuredVisibility=new IntersectionObserver(entries=>{if(!featuredMobile.matches)return;featuredRailVisible=entries[0].isIntersecting;if(featuredRailVisible){syncFeaturedRail();featuredCards[featuredIndex]?.querySelector("video")?.play().catch(()=>{})}else featuredCards.forEach(card=>card.querySelector("video")?.pause())},{threshold:.1});featuredVisibility.observe(featuredRail)}else featuredRailVisible=true;
featuredCards.forEach(card=>{const index=Number(card.dataset.project),video=card.querySelector("video"),volume=card.querySelector(".featured-volume"),seek=card.querySelector(".featured-seek");paintFeaturedSeek(seek);card.addEventListener("mouseenter",()=>setFeaturedProject(index));card.addEventListener("focus",()=>setFeaturedProject(index));card.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();card.click()}});card.addEventListener("click",event=>{if(event.target.closest(".featured-volume,.featured-seek"))return;if(index!==featuredIndex){setFeaturedProject(index);return}if(!video)return;if(video.paused){video.play().catch(()=>{});flashFeatured(card,true)}else{video.pause();flashFeatured(card,false)}});volume?.addEventListener("click",event=>{event.stopPropagation();if(index!==featuredIndex)setFeaturedProject(index);featuredSound=!featuredSound;syncFeaturedVolume();card.querySelector("video")?.play().catch(()=>{})});seek?.addEventListener("pointerdown",event=>{event.stopPropagation();featuredScrubbing=true});seek?.addEventListener("click",event=>event.stopPropagation());seek?.addEventListener("input",event=>{event.stopPropagation();seekFeaturedVideo(card)});seek?.addEventListener("change",event=>{event.stopPropagation();seekFeaturedVideo(card);featuredScrubbing=false});video?.addEventListener("timeupdate",()=>{if(card.classList.contains("active"))syncFeaturedSeek(card)});video?.addEventListener("loadedmetadata",event=>{event.currentTarget.currentTime=0;syncFeaturedSeek(card)})});
window.addEventListener("pointerup",()=>{if(featuredScrubbing){seekFeaturedVideo(featuredCards[featuredIndex]);featuredScrubbing=false}});
paintFeaturedProject(0);

const contactFooter = document.querySelector(".site-footer");
const softwareOrbit = document.querySelector(".software-grid");
const heroHologram = document.querySelector(".hero-hologram");
if (softwareOrbit && heroHologram) {
  const hologram = softwareOrbit.cloneNode(true);
  hologram.removeAttribute("aria-label");
  hologram.querySelectorAll("img").forEach(img => { img.loading = "eager"; });
  heroHologram.append(hologram);
}
document.querySelectorAll(".software-grid").forEach(softwareOrbit => {
  const satellites = [...softwareOrbit.children].filter(item => !item.querySelector(".software-resolve"));
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  softwareOrbit.classList.add("is-orbiting");
  let phase = -Math.PI / 2, frame = 0, lastTime = 0, visible = false;
  let radiusX = softwareOrbit.clientWidth * .3;
  const tilt = 39 * Math.PI / 180;
  function paintOrbit() {
    satellites.forEach((item, index) => {
      const angle = phase + index * Math.PI * 2 / satellites.length;
      const x = radiusX * Math.cos(angle), y = 155 * Math.sin(angle);
      const rotatedX = x * Math.cos(tilt) - y * Math.sin(tilt);
      const rotatedY = x * Math.sin(tilt) + y * Math.cos(tilt);
      item.style.transform = `translate(-50%,-50%) translate(${rotatedX.toFixed(2)}px,${rotatedY.toFixed(2)}px)`;
    });
  }
  function tickOrbit(now) {
    phase += Math.min(now - lastTime, 50) * Math.PI * 2 / 60000;
    lastTime = now;
    paintOrbit();
    frame = requestAnimationFrame(tickOrbit);
  }
  function syncOrbit() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (visible && !document.hidden && !motion.matches) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tickOrbit);
    }
  }
  const orbitSize = new ResizeObserver(() => {
    radiusX = softwareOrbit.clientWidth * .3;
    paintOrbit();
  });
  orbitSize.observe(softwareOrbit);
  if ("IntersectionObserver" in window) {
    const orbitVisibility = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncOrbit();
    });
    orbitVisibility.observe(softwareOrbit);
  } else { visible = true; syncOrbit(); }
  motion.addEventListener("change", syncOrbit);
  document.addEventListener("visibilitychange", syncOrbit);
  paintOrbit();
});
const contactHeadline = document.querySelector(".footer-cta");
const contactSocials = document.querySelector(".footer-bottom-social");
const contactArrow = document.querySelector(".footer-contact-arrow");
if (contactSocials) {
  const items = [...contactSocials.querySelectorAll("a")];
  const scales = items.map(() => 1);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let position = null, frame = 0, lastTime = 0;
  function animateSocialDock(now) {
    const blend = 1 - Math.exp(-Math.min(now - lastTime, 40) / 75);
    lastTime = now;
    let moving = false;
    items.forEach((item, index) => {
      const influence = position === null || motion.matches ? 0 : Math.exp(-Math.pow((index - position) / 1.05, 2));
      const target = 1 + .55 * influence;
      scales[index] += (target - scales[index]) * blend;
      if (Math.abs(target - scales[index]) < .001) scales[index] = target;
      else moving = true;
      item.style.setProperty("--social-scale", scales[index].toFixed(4));
      item.style.setProperty("--social-space", `${item.offsetWidth * (scales[index] - 1) / 2}px`);
    });
    frame = moving ? requestAnimationFrame(animateSocialDock) : 0;
  }
  function updateSocialDock(value) {
    position = value;
    if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(animateSocialDock); }
  }
  contactSocials.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    const centers = items.map(item => { const rect = item.getBoundingClientRect(); return rect.left + rect.width / 2; });
    let value = items.length - 1;
    if (event.clientX <= centers[0]) value = 0;
    else for (let i = 0; i < centers.length - 1; i++) {
      if (event.clientX <= centers[i + 1]) { value = i + (event.clientX - centers[i]) / (centers[i + 1] - centers[i]); break; }
    }
    updateSocialDock(value);
  });
  contactSocials.addEventListener("pointerleave", () => updateSocialDock(null));
  contactSocials.addEventListener("focusin", event => updateSocialDock(items.indexOf(event.target.closest("a"))));
  contactSocials.addEventListener("focusout", event => { if (!contactSocials.contains(event.relatedTarget)) updateSocialDock(null); });
  motion.addEventListener("change", () => updateSocialDock(null));
}
if (contactFooter && contactHeadline && contactSocials && contactArrow) {
  function positionContactArrow() {
    const footer = contactFooter.getBoundingClientRect();
    const headline = contactHeadline.getBoundingClientRect();
    const prompt = contactFooter.querySelector(".footer-message > .footer-label");
    if (prompt?.offsetParent) {
      const parent = prompt.offsetParent.getBoundingClientRect();
      prompt.style.setProperty("--footer-headline-top", `${headline.top - parent.top}px`);
      prompt.style.setProperty("--footer-headline-center", `${headline.left + headline.width / 2 - parent.left}px`);
    }
    const signature = contactFooter.querySelector(".footer-signature");
    if (signature) {
      signature.style.setProperty("--footer-name-top", `${headline.top - signature.getBoundingClientRect().top}px`);
    }
    const socials = contactSocials.getBoundingClientRect();
    const mail = contactSocials.querySelector("a").getBoundingClientRect();
    const x = socials.left + socials.width / 2 - footer.left;
    const endY = socials.top - footer.top - 12;
    // Keep the illustration in the open space above the contacts, including stacked layouts.
    const startY = Math.max(headline.bottom - footer.top + 18, endY - 120);
    const height = endY - startY;
    contactArrow.style.visibility = height > 24 ? "visible" : "hidden";
    contactArrow.setAttribute("viewBox", `0 0 ${footer.width} ${footer.height}`);
    const bend = Math.min(100, footer.width * .16);
    const mailX = mail.left - footer.left - 10;
    const mailY = mail.top + mail.height / 2 - footer.top;
    const turnX = Math.max(8, mailX - 40);
    contactArrow.querySelector(".footer-arrow-shaft").setAttribute("d",
      `M ${x + bend * .65} ${startY} C ${x + bend * 1.3} ${startY + height * .35}, ${turnX} ${startY + height * .3}, ${turnX} ${endY} C ${turnX} ${mailY}, ${mailX - 24} ${mailY}, ${mailX} ${mailY}`);
    contactArrow.querySelector(".footer-arrow-tip").setAttribute("d",
      `M ${mailX - 15} ${mailY - 10} Q ${mailX - 6} ${mailY - 3}, ${mailX} ${mailY} Q ${mailX - 8} ${mailY + 3}, ${mailX - 16} ${mailY + 9}`);
  }
  const contactArrowObserver = new ResizeObserver(positionContactArrow);
  [contactFooter, contactHeadline, contactSocials].forEach(element => contactArrowObserver.observe(element));
  document.fonts.ready.then(positionContactArrow);
  contactFooter.addEventListener("animationend", event => {
    if (event.target.matches(".footer-reveal") && event.animationName === "revealPremium") positionContactArrow();
  });
  window.addEventListener("resize", positionContactArrow, { passive: true });
  positionContactArrow();
  const contactMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let replayTimer = 0;
  function revealContact() {
    contactFooter.classList.add("contact-drawn");
  }
  function replayContact() {
    if (!contactFooter.classList.contains("contact-drawn") || contactMotion.matches) {
      revealContact();
      return;
    }
    clearTimeout(replayTimer);
    contactFooter.classList.add("contact-replaying");
    replayTimer = setTimeout(() => contactFooter.classList.remove("contact-replaying"), 260);
  }
  if ("IntersectionObserver" in window) {
    const contactRevealObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        revealContact();
        contactRevealObserver.disconnect();
      }
    }, { threshold: .4 });
    contactRevealObserver.observe(contactHeadline);
  } else revealContact();
  contactHeadline.addEventListener("pointerenter", event => {
    if (event.pointerType !== "touch") replayContact();
  });
  contactHeadline.addEventListener("focus", replayContact);
  contactMotion.addEventListener("change", () => {
    clearTimeout(replayTimer);
    contactFooter.classList.remove("contact-replaying");
  });
}
