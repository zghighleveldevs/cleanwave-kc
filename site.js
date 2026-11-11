(function(){
  // mobile menu
  var b=document.getElementById('burger'),m=document.getElementById('mnav');
  if(b&&m){
    b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  }
  // multi-step quote form (preview until the GoHighLevel form is embedded)
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
    if(s===1){var z=document.getElementById('zip');if(z.value&&!/^\d{5}$/.test(z.value)&&bad.indexOf(z)<0)bad.push(z)}
    if(bad.length){
      err.textContent='Please fill in: '+bad.map(function(el){return f.querySelector('label[for="'+el.id+'"]').textContent.toLowerCase()}).join(', ')+'.';
      err.hidden=false;bad[0].focus();return false;
    }
    return true;
  }
  document.getElementById('hc').addEventListener('change',function(e){document.getElementById('whyBox').hidden=e.target.value!=='Yes'});
  back.addEventListener('click',function(){s--;show()});
  f.addEventListener('submit',function(e){
    e.preventDefault(); if(!valid()) return;
    if(s===1&&document.getElementById('ft').value==='residential'){location.href='residential.html';return}
    if(s<2){s++;show();steps[s].querySelector('input,select,textarea').focus();return}
    location.href='thank-you.html';
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
  if(document.querySelector('main[data-page="thank-you"]')){
    var done=false; try{ done=sessionStorage.getItem('cw_lead_fired')==='1'; }catch(e){}
    if(!done){
      if(typeof window.fbq==='function') window.fbq('track','Lead');
      if(typeof window.gtag==='function') window.gtag('event','generate_lead');
      try{ sessionStorage.setItem('cw_lead_fired','1'); }catch(e){}
    }
  }
})();
