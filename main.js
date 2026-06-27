// Debbie's static site behaviors
(function(){
  // Header scroll
  const header=document.querySelector('.site-header');
  if(header){
    const onScroll=()=>{header.classList.toggle('scrolled',window.scrollY>24)};
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  }
  // Mobile menu
  const toggle=document.querySelector('.menu-toggle');
  const mobile=document.querySelector('.mobile-menu');
  if(toggle&&mobile){
    toggle.addEventListener('click',()=>{
      const open=mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded',open);
      toggle.innerHTML=open?iconClose():iconMenu();
    });
  }
  // Active nav
  const path=location.pathname.replace(/\/index\.html$/,'/').replace(/\.html$/,'');
  document.querySelectorAll('[data-nav]').forEach(a=>{
    const t=a.dataset.nav;
    const norm=path==='/'?'/':path;
    if(t==='/'&&(norm==='/'||norm==='/index'||norm===''))a.classList.add('active');
    else if(t!=='/'&&norm.startsWith(t))a.classList.add('active');
  });

  // Reveal observer
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}});
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>{
    const d=el.dataset.delay;
    if(d) el.style.transitionDelay=d+'ms';
    io.observe(el);
  });

  // Back to top
  const btt=document.querySelector('.back-to-top');
  if(btt){
    const on=()=>btt.classList.toggle('show',window.scrollY>600);
    on();window.addEventListener('scroll',on,{passive:true});
    btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item,idx)=>{
    if(idx===0) item.classList.add('open');
    item.querySelector('button.q').addEventListener('click',()=>{
      item.classList.toggle('open');
    });
  });

  // Gallery filter + lightbox
  const gallery=document.querySelector('[data-gallery]');
  if(gallery){
    const tiles=[...gallery.querySelectorAll('.tile')];
    const chips=document.querySelectorAll('[data-filter]');
    chips.forEach(c=>c.addEventListener('click',()=>{
      chips.forEach(x=>x.classList.remove('active'));
      c.classList.add('active');
      const f=c.dataset.filter;
      tiles.forEach(t=>{t.style.display=(f==='All'||t.dataset.cat===f)?'block':'none';});
    }));
    // lightbox
    let idx=0; const visible=()=>tiles.filter(t=>t.style.display!=='none');
    const lb=document.getElementById('lightbox');
    const lbImg=lb.querySelector('img');
    const open=(i)=>{const v=visible(); idx=i; lbImg.src=v[idx].querySelector('img').src; lb.style.display='flex'; document.body.style.overflow='hidden';};
    tiles.forEach((t,i)=>t.addEventListener('click',()=>{const v=visible();open(v.indexOf(t));}));
    const close=()=>{lb.style.display='none';document.body.style.overflow='';};
    lb.querySelector('.close').addEventListener('click',close);
    lb.addEventListener('click',e=>{if(e.target===lb)close();});
    lb.querySelector('.prev').addEventListener('click',e=>{e.stopPropagation();const v=visible();idx=(idx-1+v.length)%v.length;lbImg.src=v[idx].querySelector('img').src;});
    lb.querySelector('.next').addEventListener('click',e=>{e.stopPropagation();const v=visible();idx=(idx+1)%v.length;lbImg.src=v[idx].querySelector('img').src;});
    document.addEventListener('keydown',e=>{if(lb.style.display!=='flex')return;
      if(e.key==='Escape')close();
      if(e.key==='ArrowRight'){const v=visible();idx=(idx+1)%v.length;lbImg.src=v[idx].querySelector('img').src;}
      if(e.key==='ArrowLeft'){const v=visible();idx=(idx-1+v.length)%v.length;lbImg.src=v[idx].querySelector('img').src;}
    });
  }

  // Booking form
  const form=document.querySelector('[data-booking-form]');
  if(form){
    const FORMSPREE=form.dataset.endpoint||'';
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const btn=form.querySelector('button[type=submit]');
      const original=btn.innerHTML;
      btn.disabled=true; btn.innerHTML='<span class="spin" style="display:inline-block;width:14px;height:14px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%"></span> Sending…';
      try{
        if(FORMSPREE && !FORMSPREE.includes('REPLACE')){
          const res=await fetch(FORMSPREE,{method:'POST',headers:{Accept:'application/json'},body:new FormData(form)});
          if(!res.ok) throw new Error('Network');
        } else {
          await new Promise(r=>setTimeout(r,900));
        }
        document.getElementById('booking-success').style.display='flex';
        form.reset();
      }catch(err){
        alert('Something went wrong. Please call us directly.');
      }finally{ btn.disabled=false; btn.innerHTML=original; }
    });
    const closeBtn=document.querySelector('#booking-success button');
    if(closeBtn) closeBtn.addEventListener('click',()=>document.getElementById('booking-success').style.display='none');
  }

  // Animated rating counter
  const counter=document.querySelector('[data-rating-counter]');
  if(counter){
    const target=4.9; const start=performance.now();
    const tick=t=>{const p=Math.min(1,(t-start)/1400); counter.textContent=(p*target).toFixed(1); if(p<1) requestAnimationFrame(tick);};
    requestAnimationFrame(tick);
  }

  function iconMenu(){return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>';}
  function iconClose(){return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';}
  window.__icons={menu:iconMenu,close:iconClose};
})();
