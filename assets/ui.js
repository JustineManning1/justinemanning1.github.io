/* ui.js - theme toggle, scroll-triggered count-up, hero data-line motif */
(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
  var mode=saved||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  root.setAttribute('data-theme',mode);
  var btn=document.createElement('button');
  btn.className='theme-toggle';btn.type='button';
  btn.setAttribute('aria-label','Toggle dark mode');
  btn.innerHTML='<span class="tt-track"><span class="tt-thumb"></span></span>';
  function repaintCharts(dark){
    if(typeof Chart==='undefined'||!Chart.getChart)return;
    var tick=dark?'#A3B5CC':'#4C617C';
    var grid=dark?'rgba(163,181,204,.16)':'#EDF1F5';
    var head=dark?'#E8EFF8':'#122A46';
    Chart.defaults.color=tick;
    Array.prototype.forEach.call(document.querySelectorAll('canvas'),function(c){
      var ch=Chart.getChart(c);if(!ch)return;
      var sc=ch.options.scales||{};
      Object.keys(sc).forEach(function(k){
        if(sc[k].ticks)sc[k].ticks.color=tick;
        if(sc[k].grid&&sc[k].grid.color)sc[k].grid.color=grid;
      });
      var pl=ch.options.plugins||{};
      if(pl.legend&&pl.legend.labels)pl.legend.labels.color=tick;
      if(pl.title)pl.title.color=head;
      ch.update('none');
    });
  }
  function apply(m){
    root.setAttribute('data-theme',m);
    btn.setAttribute('aria-pressed',m==='dark'?'true':'false');
    btn.title=m==='dark'?'Switch to light mode':'Switch to dark mode';
    try{localStorage.setItem('theme',m)}catch(e){}
    repaintCharts(m==='dark');
  }
  btn.addEventListener('click',function(){apply(root.getAttribute('data-theme')==='dark'?'light':'dark')});
  var NUM=/^([^0-9-]*)(-?[0-9,]+(?:\.[0-9]+)?)([\s\S]*)$/;
  function countUp(el){
    if(el.getAttribute('data-counted'))return;
    var m=NUM.exec(el.textContent.trim());if(!m)return;
    var pre=m[1],raw=m[2],suf=m[3];
    var target=parseFloat(raw.replace(/,/g,''));if(!isFinite(target))return;
    el.setAttribute('data-counted','1');
    var dec=(raw.split('.')[1]||'').length,grp=raw.indexOf(',')>-1;
    function out(v){
      var s=dec?v.toFixed(dec):String(Math.round(v));
      if(grp)s=s.replace(/\B(?=([0-9]{3})+(?![0-9]))/g,',');
      return pre+s+suf;
    }
    var t0=0,dur=1000;
    function frame(now){
      if(!t0)t0=now;
      var p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);
      el.textContent=out(target*e);
      if(p<1)requestAnimationFrame(frame);else el.textContent=pre+raw+suf;
    }
    el.textContent=out(0);
    requestAnimationFrame(frame);
  }
  function motif(hero){
    var s='<svg class="hero-motif" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true">';
    s+='<path class="l1" d="M0,330 C60,300 120,340 180,300 C240,258 300,282 360,240 C420,198 480,232 540,190 C600,150 660,176 720,142 C780,110 840,132 900,96 C960,62 1020,84 1080,54 C1140,26 1170,36 1200,22"/>';
    s+='<path class="l2" d="M0,368 C70,352 140,376 210,346 C280,318 350,344 420,312 C490,282 560,306 630,278 C700,250 770,272 840,240 C910,210 980,232 1050,198 C1120,166 1160,180 1200,158"/>';
    s+='<path class="l3" d="M0,268 C80,286 160,244 240,262 C320,280 400,236 480,258 C560,280 640,232 720,254 C800,276 880,228 960,248 C1040,268 1120,224 1200,244"/>';
    s+='<circle class="dot" cx="360" cy="240" r="4"/><circle class="dot d2" cx="720" cy="142" r="4"/><circle class="dot d3" cx="1050" cy="198" r="4"/></svg>';
    hero.insertAdjacentHTML('afterbegin',s);
  }
  function init(){
    var nav=document.querySelector('nav.links');
    if(nav)nav.appendChild(btn);
    apply(mode);
    var hero=document.querySelector('.hero-band');
    if(hero&&!reduce&&!hero.querySelector('.hero-motif'))motif(hero);
    if(reduce||!('IntersectionObserver' in window))return;
    var io=new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(!en.isIntersecting)return;
        io.unobserve(en.target);
        var nums=en.target.querySelectorAll('.num,.hub-val');
        Array.prototype.forEach.call(nums,function(n,i){setTimeout(function(){countUp(n)},i*90)});
      });
    },{threshold:.35});
    Array.prototype.forEach.call(document.querySelectorAll('#kpis,.hub-card'),function(g){io.observe(g)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
