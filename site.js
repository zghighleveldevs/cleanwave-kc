(function(){
  // mobile menu
  var b=document.getElementById('burger'),m=document.getElementById('mnav');
  if(b&&m){
    b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  }
  // multi-step quote form. Posts to the same GoHighLevel inbound webhook as the walkthrough funnel,
  // then opens the booking calendar (book.html) with the contact details pre-filled.
  var GHL_WEBHOOK_URL='https://services.leadconnectorhq.com/hooks/JgqazA9K8zxUtR2rZezR/webhook-trigger/d50bf8da-8275-4fed-9d60-32f199e4148f';
  var BOOKING_PAGE='book.html';
  var f=document.getElementById('qform'); if(!f) return;
  var steps=[].slice.call(f.querySelectorAll('.qs')),bars=[].slice.call(f.querySelectorAll('.progress i'));
  var labels=['Your contact info','Your facility','Your situation'];
  var next=document.getElementById('next'),back=document.getElementById('back'),err=document.getElementById('err');
  var s=0;
  function show(){
    steps.forEach(function(x,i){x.hidden=i!==s});
    bars.forEach(function(x,i){x.classList.toggle('on',i<=s)});
    document.getElementById('stepl').textContent='Step '+(s+1)+' of 3 · '+labels[s];
    back.hidden=s===0;
    next.innerHTML=s===2?'Get My Free Walkthrough':'Next <svg class="ico"><use href="#i-arrow"/></svg>';
    err.hidden=true;
  }
  function valid(){
    var bad=[].slice.call(steps[s].querySelectorAll('[required]')).filter(function(el){
      return !el.value.trim()||(el.type==='email'&&!/^\S+@\S+\.\S+$/.test(el.value));
    });
    if(s===0){var p=document.getElementById('ph');if(p.value&&p.value.replace(/\D/g,'').length<10&&bad.indexOf(p)<0)bad.push(p)}
    if(s===1){var z=document.getElementById('zip');if(z.value&&!/^\d{5}$/.test(z.value)&&bad.indexOf(z)<0)bad.push(z)}
    if(bad.length){
      err.textContent='Please fill in: '+bad.map(function(el){return f.querySelector('label[for="'+el.id+'"]').textContent.toLowerCase()}).join(', ')+'.';
      err.hidden=false;bad[0].focus();return false;
    }
    return true;
  }
  document.getElementById('hc').addEventListener('change',function(e){document.getElementById('whyBox').hidden=e.target.value!=='Yes, switching'});
  back.addEventListener('click',function(){s--;show()});
  f.addEventListener('submit',function(e){
    e.preventDefault(); if(!valid()) return;
    if(s===1&&document.getElementById('ft').value==='residential'){location.href='residential.html';return}
    if(s<2){s++;show();steps[s].querySelector('input,select,textarea').focus();return}
    var data={source:'Website',page:location.pathname};
    [].forEach.call(f.elements,function(el){
      if(!el.name||el.disabled) return;
      if(el.type==='checkbox'){ if(el.name==='sms_consent') data.sms_consent=el.checked?'yes':'no'; else if(el.checked) data[el.name]=(data[el.name]?data[el.name]+', ':'')+el.value; return; }
      var v=(el.value||'').trim(); if(v) data[el.name]=v;
    });
    var q=new URLSearchParams();
    ['first_name','last_name','email','phone','company_name'].forEach(function(k){ if(data[k]) q.set(k,data[k]); });
    var dest=BOOKING_PAGE+'?'+q.toString();
    next.disabled=true; next.textContent='Sending…';
    try{ sessionStorage.setItem('cw_lead_pending','1'); }catch(err){}
    var go=function(){ location.href=dest; };
    if(!GHL_WEBHOOK_URL){ go(); return; }
    var t=setTimeout(go,4000);
    fetch(GHL_WEBHOOK_URL,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      .catch(function(){}).then(function(){ clearTimeout(t); go(); });
  });
})();

/* ================= ANIMATIONS ================= */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header shadow on scroll
  var top = document.querySelector('.top');
  function onScroll(){ if(top) top.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // hero: zooming photo layer + twinkling sparkles
  [].forEach.call(document.querySelectorAll('.hero'), function(h){
    var z = document.createElement('div'); z.className = 'bgzoom'; z.setAttribute('aria-hidden','true');
    h.insertBefore(z, h.firstChild);
    if (reduce) return;
    var spots = [[8,22],[88,18],[14,72],[92,66],[70,84],[30,12]];
    spots.forEach(function(p, i){
      var s = document.createElement('span'); s.className = 'spark'; s.setAttribute('aria-hidden','true');
      s.style.left = p[0] + '%'; s.style.top = p[1] + '%';
      s.style.animationDelay = (i * .55) + 's';
      var size = 10 + (i % 3) * 6; s.style.width = s.style.height = size + 'px';
      s.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 0c.6 6.5 5.5 11.4 12 12-6.5.6-11.4 5.5-12 12-.6-6.5-5.5-11.4-12-12C6.5 11.4 11.4 6.5 12 0z"/></svg>';
      h.appendChild(s);
    });
  });

  // animated wave edge on CTA bands
  var wavePath = 'M0 40 C 150 70 350 10 500 40 C 650 70 850 10 1000 40 C 1150 70 1350 10 1500 40 C 1650 70 1850 10 2000 40 L2000 80 L0 80 Z';
  [].forEach.call(document.querySelectorAll('.cta'), function(c){
    var w = document.createElement('div'); w.className = 'waves'; w.setAttribute('aria-hidden','true');
    w.innerHTML = '<svg class="w2" viewBox="0 0 2000 80" preserveAspectRatio="none"><path d="'+wavePath+'"/></svg><svg viewBox="0 0 2000 80" preserveAspectRatio="none"><path d="'+wavePath+'"/></svg>';
    c.appendChild(w);
  });

  // stagger indexes for list items and chips
  [].forEach.call(document.querySelectorAll('.vs ul, .checks, .chips'), function(list){
    [].forEach.call(list.children, function(el, i){ el.style.setProperty('--i', i); });
  });

  if (reduce || !('IntersectionObserver' in window)) return;

  // scroll reveal: only for content that starts below the first screen
  var sel = ['.sec .head', '.grid > *', '.split .media', '.split .copy', '.owner .photo', '.owner .copy',
             '.steps', '.vs', '.checks', '.chips', '.area-note', '.faq > *', '.cta .wrap > *:not(.waves)',
             '.form', '.aside > *', '.doc > *', '.cal', '.center'];
  var fold = window.innerHeight * 0.95;
  var targets = [];
  sel.forEach(function(s){
    [].forEach.call(document.querySelectorAll(s), function(el){
      if (targets.indexOf(el) > -1) return;
      if (el.closest('.hero')) return;
      if (el.getBoundingClientRect().top < fold) return;
      targets.push(el);
    });
  });
  targets.forEach(function(el){
    el.classList.add('rv');
    if (el.matches('.split .media')) el.classList.add(el.closest('.split').classList.contains('flip') ? 'rv-right' : 'rv-left');
    if (el.matches('.owner .photo')) el.classList.add('rv-zoom');
    var p = el.parentElement;
    if (p && (p.classList.contains('grid') || p.classList.contains('faq') || p.classList.contains('aside') || p.classList.contains('doc'))) {
      var idx = [].indexOf.call(p.children, el);
      el.style.setProperty('--d', Math.min(idx, 8) * 0.09 + 's');
    }
    if (p && p.matches('.cta .wrap')) el.style.setProperty('--d', [].indexOf.call(p.children, el) * 0.12 + 's');
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ var t=e.target; t.classList.add('in'); io.unobserve(t); setTimeout(function(){ t.style.setProperty('--d','0s'); }, 1600); }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
  targets.forEach(function(el){ io.observe(el); });
})();

/* ================= AD ATTRIBUTION, HEADLINE MATCH & CONVERSIONS ================= */
(function(){
  var KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','v'];
  var store={};
  try{ store=JSON.parse(sessionStorage.getItem('cw_attr')||'{}'); }catch(e){}
  var q=new URLSearchParams(location.search), changed=false;
  KEYS.forEach(function(k){ var val=q.get(k); if(val && !store[k]){ store[k]=val.slice(0,200); changed=true; } });
  if(!store.landing_page){ store.landing_page=location.pathname; changed=true; }
  if(changed){ try{ sessionStorage.setItem('cw_attr',JSON.stringify(store)); }catch(e){} }
  // fill hidden fields in the quote form
  [].forEach.call(document.querySelectorAll('input[data-attr]'),function(el){ var k=el.getAttribute('data-attr'); if(store[k]) el.value=store[k]; });

  // match the landing-page headline to the ad the visitor clicked (?v=)
  var main=document.querySelector('main[data-page="lp"]');
  if(main){
    var V={
      missed:['Did your cleaning company <em>skip a night</em> this month?','Get a written checklist, a supervisor-trained crew and a direct line to the owner. Free 30-minute walkthrough, written quote within 24 hours.'],
      owner:['When you call CleanWave, you get <em>the owner</em>. Not a salesperson.','Justin walks your building, writes your scope and stays your direct contact after you start. Free walkthrough, written quote within 24 hours.'],
      walkthrough:['One 30-minute walkthrough. <em>A written quote in 24 hours.</em>','Justin meets you on site, walks every space with you and builds a cleaning plan around your hours. No cost, no pressure.'],
      signs:['Checking your cleaner’s work? <em>It’s time to switch.</em>','Missed cleanings, no call backs, a new crew every few weeks? Get a second opinion from CleanWave KC. It costs nothing.'],
      monday:['Walk into a <em>spotless office</em> every Monday morning.','Empty trash, restocked restrooms, clean floors and streak-free glass, checked by supervisors and backed by the owner.']
    };
    var key=(q.get('v')||store.v||'').toLowerCase();
    if(V[key]){ document.getElementById('lp-h').innerHTML=V[key][0]; document.getElementById('lp-s').textContent=V[key][1]; }
    // sticky mobile bar appears once the form scrolls out of view
    var bar=document.getElementById('lpbar'), form=document.getElementById('form');
    if(bar && form && 'IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es.forEach(function(e){ bar.classList.toggle('show', !e.isIntersecting); }); },{threshold:0}).observe(form);
    }
  }

  // conversion event: fires once when the thank-you page loads (needs the Meta Pixel / Google tag installed)
  function once(key,fn){ var d=false; try{ d=sessionStorage.getItem(key)==='1'; }catch(e){} if(d) return; fn(); try{ sessionStorage.setItem(key,'1'); }catch(e){} }
  // Lead: the quote form was submitted and the visitor reached the booking calendar
  if(document.body.getAttribute('data-page')==='book'){
    var pending=false; try{ pending=sessionStorage.getItem('cw_lead_pending')==='1'; }catch(e){}
    if(/\/apply(\?|#|$)/.test(document.referrer.replace(/^https?:\/\/[^/]+/,''))) pending=true; // funnel served at /apply
    if(pending) once('cw_lead_fired',function(){
      if(typeof window.fbq==='function') window.fbq('track','Lead');
      if(typeof window.gtag==='function') window.gtag('event','generate_lead');
    });
  }
  // Schedule: GoHighLevel redirected here after a walkthrough was booked
  if(document.querySelector('main[data-page="thank-you"]')){
    once('cw_schedule_fired',function(){
      if(typeof window.fbq==='function') window.fbq('track','Schedule');
      if(typeof window.gtag==='function') window.gtag('event','book_appointment');
    });
  }
})();

/* ================= 3D REVIEW COVERFLOW ================= */
(function(){
  var stage=document.getElementById('cf-stage'); if(!stage) return;
  var cards=[].slice.call(stage.querySelectorAll('.cf-card')), n=cards.length, idx=0, timer;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dotsWrap=document.getElementById('cf-dots'), dots=[];
  cards.forEach(function(c,i){
    var d=document.createElement('button'); d.type='button'; d.setAttribute('aria-label','Show review '+(i+1)+' of '+n);
    d.addEventListener('click',function(){ go(i); restart(); }); dotsWrap.appendChild(d); dots.push(d);
    c.addEventListener('click',function(){ if(i!==idx){ go(i); restart(); } });
  });
  function layout(){
    var narrow=stage.clientWidth<700;
    cards.forEach(function(c,i){
      var o=i-idx; if(o>n/2) o-=n; if(o<-n/2) o+=n;
      var a=Math.abs(o), sgn=o<0?-1:1, t, op=1, z=10-a;
      if(a===0) t='translate3d(0,0,60px) rotateY(0deg)';
      else if(a===1) t='translate3d('+(sgn*(narrow?72:62))+'%,0,-160px) rotateY('+(-sgn*(narrow?32:40))+'deg) scale(.92)';
      else if(a===2) t='translate3d('+(sgn*(narrow?125:112))+'%,0,-340px) rotateY('+(-sgn*52)+'deg) scale(.84)', op=narrow?0:.55;
      else t='translate3d('+(sgn*150)+'%,0,-520px) rotateY('+(-sgn*60)+'deg) scale(.7)', op=0;
      c.style.transform=t; c.style.opacity=op; c.style.zIndex=z; c.style.filter=a?'brightness(.78) saturate(.85)':'none';
      c.style.pointerEvents=op?'auto':'none';
      c.classList.toggle('is-front',a===0); c.setAttribute('aria-hidden',a===0?'false':'true');
    });
    dots.forEach(function(d,i){ d.classList.toggle('on',i===idx); });
  }
  function go(k){ idx=(k+n)%n; layout(); }
  function restart(){ clearInterval(timer); if(!reduce) timer=setInterval(function(){ go(idx+1); },5000); }
  document.getElementById('cf-prev').addEventListener('click',function(){ go(idx-1); restart(); });
  document.getElementById('cf-next').addEventListener('click',function(){ go(idx+1); restart(); });
  stage.addEventListener('mouseenter',function(){ clearInterval(timer); });
  stage.addEventListener('mouseleave',restart);
  // drag / swipe
  var sx=null;
  stage.addEventListener('pointerdown',function(e){ sx=e.clientX; });
  window.addEventListener('pointerup',function(e){ if(sx===null) return; var dx=e.clientX-sx; sx=null; if(Math.abs(dx)>40){ go(idx+(dx<0?1:-1)); restart(); } });
  // the front card tilts toward the cursor
  if(!reduce && window.matchMedia('(pointer: fine)').matches){
    stage.addEventListener('mousemove',function(e){
      var c=cards[idx], inner=c.querySelector('.cf-inner'), r=c.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
      if(x<-.2||x>1.2||y<-.2||y>1.2){ inner.style.transform=''; return; }
      inner.style.transform='rotateY('+((x-.5)*16).toFixed(1)+'deg) rotateX('+((.5-y)*12).toFixed(1)+'deg)';
      inner.style.setProperty('--mx',(x*100).toFixed(0)+'%'); inner.style.setProperty('--my',(y*100).toFixed(0)+'%');
    });
    stage.addEventListener('mouseleave',function(){ cards.forEach(function(c){ c.querySelector('.cf-inner').style.transform=''; }); });
  }
  window.addEventListener('resize',layout);
  layout(); restart();
})();
