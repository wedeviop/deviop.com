/* ══════════════════════════════
   DEVIOP — main.js
   Shared across index + services
══════════════════════════════ */

/* ── Custom cursor ── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
if(cursor){
  let fx=0,fy=0,cx=window.innerWidth/2,cy=window.innerHeight/2;
  document.addEventListener('mousemove',e=>{
    cx=e.clientX; cy=e.clientY;
    cursor.style.left=cx+'px';
    cursor.style.top =cy+'px';
  });
  (function animFollower(){
    fx+=(cx-fx)*0.12; fy+=(cy-fy)*0.12;
    follower.style.left=fx+'px';
    follower.style.top =fy+'px';
    requestAnimationFrame(animFollower);
  })();
  document.querySelectorAll('a,button,.pf-item,.svc-card,.testi-card,.cs-card,.faq-q').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
}

/* ── Sticky nav ── */
const nav=document.getElementById('navbar');
if(nav){
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>60),{passive:true});
}

/* ── Mobile nav ── */
const burger=document.getElementById('burger');
const navLinks=document.getElementById('navLinks');
if(burger&&navLinks){
  burger.addEventListener('click',()=>{
    navLinks.classList.toggle('open');
    burger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    navLinks.classList.remove('open');
    burger.classList.remove('active');
  }));
}

/* ── Active nav link ── */
const currentPage=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('#navLinks a').forEach(a=>{
  if(a.getAttribute('href')===currentPage||
     (currentPage==='' && a.getAttribute('href')==='index.html')){
    a.classList.add('active-link');
  }
});

/* ── Hero reel parallax ── */
const heroReel=document.getElementById('heroReel');
if(heroReel){
  window.addEventListener('load',()=>heroReel.classList.add('loaded'));
  window.addEventListener('scroll',()=>{
    const s=window.scrollY;
    heroReel.style.transform=`scale(1.08) translateY(${s*0.25}px)`;
  },{passive:true});
}

/* ── Portfolio 3D tilt ── */
document.querySelectorAll('.pf-item').forEach(item=>{
  item.addEventListener('mousemove',e=>{
    const r=item.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width -0.5;
    const y=(e.clientY-r.top) /r.height-0.5;
    item.style.transform=`perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) scale(1.02)`;
    item.style.transition='transform 0.1s linear';
  });
  item.addEventListener('mouseleave',()=>{
    item.style.transform='perspective(600px) rotateY(0) rotateX(0) scale(1)';
    item.style.transition='transform 0.55s var(--ease)';
  });
});

/* ── Portfolio filter ── */
document.querySelectorAll('.pf-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.pf-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat=btn.dataset.cat;
    document.querySelectorAll('.pf-item').forEach(item=>{
      const show=cat==='all'||item.dataset.cat===cat;
      item.style.opacity=show?'1':'0.12';
      item.style.transform=show?'':'scale(0.97)';
      item.style.transition='opacity .4s,transform .4s';
    });
  });
});

/* ── Draggable horizontal services scroll ── */
const svcOuter=document.querySelector('.svc-scroll-outer');
const svcTrack=document.getElementById('svcTrack');
if(svcOuter&&svcTrack){
  let isDrag=false,startX=0,scrollLeft=0;
  svcOuter.addEventListener('mousedown',e=>{
    isDrag=true; startX=e.pageX-svcOuter.offsetLeft;
    scrollLeft=svcOuter.scrollLeft; svcOuter.style.cursor='grabbing';
  });
  svcOuter.addEventListener('mouseleave',()=>{isDrag=false;svcOuter.style.cursor='grab'});
  svcOuter.addEventListener('mouseup',  ()=>{isDrag=false;svcOuter.style.cursor='grab'});
  svcOuter.addEventListener('mousemove',e=>{
    if(!isDrag)return; e.preventDefault();
    svcOuter.scrollLeft=scrollLeft-(e.pageX-svcOuter.offsetLeft-startX)*1.5;
  });
  svcOuter.addEventListener('touchstart',e=>{
    startX=e.touches[0].pageX; scrollLeft=svcOuter.scrollLeft;
  },{passive:true});
  svcOuter.addEventListener('touchmove',e=>{
    svcOuter.scrollLeft=scrollLeft-(e.touches[0].pageX-startX)*1.5;
  },{passive:true});
}

/* ── Magnetic buttons ── */
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*0.22;
    const y=(e.clientY-r.top-r.height/2)*0.22;
    btn.style.transform=`translate(${x}px,${y-2}px)`;
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
});

/* ── Scroll reveal ── */
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const delay=parseInt(e.target.dataset.delay||0);
      setTimeout(()=>e.target.classList.add('revealed'),delay);
      revObs.unobserve(e.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('[data-reveal]').forEach(el=>revObs.observe(el));

/* ── Counter animation ── */
function animCounter(el){
  const target=parseInt(el.dataset.count);
  const suffix=el.dataset.suffix||'';
  let cur=0; const inc=target/110;
  const t=setInterval(()=>{
    cur+=inc;
    if(cur>=target){cur=target;clearInterval(t);}
    el.textContent=Math.floor(cur)+suffix;
  },16);
}
const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('[data-count]').forEach(animCounter);
      statsObs.unobserve(e.target);
    }
  });
},{threshold:0.5});
const statsSection=document.querySelector('.stats-row');
if(statsSection) statsObs.observe(statsSection);

/* ── Service tabs (services page) ── */
document.querySelectorAll('.svc-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.svc-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.svc-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    const panel=document.getElementById(tab.dataset.target);
    if(panel){
      panel.classList.add('active');
      // Scroll to panel top smoothly
      setTimeout(()=>{
        const offset=panel.getBoundingClientRect().top+window.scrollY-120;
        window.scrollTo({top:offset,behavior:'smooth'});
      },50);
    }
  });
});

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement;
    const wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

/* ── Image parallax on scroll (gallery images) ── */
const parallaxImgs=document.querySelectorAll('.hero-reel-cell img');
window.addEventListener('scroll',()=>{
  const s=window.scrollY;
  parallaxImgs.forEach((img,i)=>{
    const dir=i%2===0?1:-1;
    img.style.transform=`scale(1.08) translateY(${dir*s*0.04}px)`;
  });
},{passive:true});
