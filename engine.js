/* Reusable dashboard engine — one CONFIG object per page.
   Renders: group filters, metric tabs, weighted KPIs, annotated trend line,
   stacked volume mix, insight bar. */
const MONTHS = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'];
const fmt = n => n.toLocaleString();
Chart.defaults.font.family = "'IBM Plex Mono', monospace";
Chart.defaults.color = '#4C617C';

function annoPlugin(month, label){
  return { id:'anno', afterDatasetsDraw(chart){
    const i = chart.data.labels.indexOf(month); if(i<0) return;
    const x = chart.scales.x.getPixelForValue(i);
    const {top,bottom,right} = chart.chartArea, c = chart.ctx;
    c.save(); c.setLineDash([4,4]); c.strokeStyle='#B3382E'; c.lineWidth=1.5;
    c.beginPath(); c.moveTo(x,top); c.lineTo(x,bottom); c.stroke(); c.setLineDash([]);
    c.fillStyle='#B3382E'; c.font="600 9px 'IBM Plex Mono', monospace"; c.textAlign='left';
    c.fillText('\u25BC '+label, Math.min(x+5, right-130), top+10); c.restore();
  }};
}

function buildDash(cfg){
  const S = { g:'all', metric:cfg.defaultMetric };
  const keys = () => S.g==='all' ? Object.keys(cfg.data) : [S.g];
  const W = (m,i) => {
    if(m===cfg.volKey) return keys().reduce((s,k)=>s+cfg.data[k][cfg.volKey][i],0);
    let n=0,d=0; keys().forEach(k=>{ n+=cfg.data[k][m][i]*cfg.data[k][cfg.volKey][i]; d+=cfg.data[k][cfg.volKey][i]; });
    return n/d;
  };
  const rnd = (v,d) => d ? Math.round(v*10**d)/10**d : Math.round(v);

  function kpis(){
    document.getElementById('kpis').innerHTML = Object.keys(cfg.metrics).map(m=>{
      const M = cfg.metrics[m];
      const now = rnd(W(m,11),M.dec), start = rnd(W(m,0),M.dec), delta = rnd(now-start,M.dec);
      const good = M.higherBetter ? delta>0 : delta<0;
      const act = m===S.metric ? 'style="background:var(--accent-soft)"' : '';
      const dTxt = delta===0 ? '\u00B1 0' : (delta>0?'+':'')+(m===cfg.volKey?fmt(delta):delta);
      return `<div class="kpi" ${act}><div class="num">${M.pre||''}${m===cfg.volKey?fmt(now):now}${M.unit}</div>
        <div class="lab">${M.label}</div><div class="delta ${good?'up':'down'}">${dTxt} vs Aug</div></div>`;
    }).join('');
  }

  const main = new Chart(document.getElementById('mainChart'), {
    type:'line', data:{labels:MONTHS, datasets:[]},
    options:{ responsive:true, maintainAspectRatio:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:12,padding:14,font:{size:10}}},
        title:{display:true,font:{size:12,weight:'600'},color:'#122A46',padding:{bottom:10}},
        tooltip:{callbacks:{label:c=>` ${c.dataset.label}: ${(cfg.metrics[S.metric].pre||'')}${cfg.metrics[S.metric].dec?c.parsed.y.toFixed(1):fmt(Math.round(c.parsed.y))}${cfg.metrics[S.metric].unit}`}}},
      scales:{ y:{grid:{color:'#EDF1F5'}}, x:{grid:{display:false},ticks:{font:{size:9}}} } },
    plugins:[annoPlugin(cfg.anno.month, cfg.anno.label)]
  });
  function mainR(){
    const M = cfg.metrics[S.metric];
    main.data.datasets = keys().map(k=>({ label:cfg.data[k].name, data:cfg.data[k][S.metric],
      borderColor:cfg.data[k].color, backgroundColor:cfg.data[k].color,
      tension:.3, pointRadius:3, pointHoverRadius:6, borderWidth:2.5 }));
    main.options.plugins.title.text = M.label + (M.unit==='%'?' (%)':M.unit?` (${M.unit.trim()})`:'');
    main.options.scales.y.min = M.axis[0]; main.options.scales.y.max = M.axis[1];
    main.options.scales.y.ticks = { callback:v => M.unit==='%' ? v+'%' : (M.pre||'')+fmt(v) };
    main.update();
  }

  const mix = new Chart(document.getElementById('mixChart'), {
    type:'bar', data:{labels:MONTHS, datasets:[]},
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{position:'bottom',labels:{boxWidth:12,padding:14,font:{size:10}}},
        title:{display:true,text:cfg.mixTitle,font:{size:12,weight:'600'},color:'#122A46',padding:{bottom:10}} },
      scales:{ x:{stacked:true,grid:{display:false},ticks:{font:{size:9}}},
               y:{stacked:true,grid:{color:'#EDF1F5'},ticks:{callback:v=>fmt(v)}} } }
  });
  function mixR(){
    mix.data.datasets = keys().map(k=>({ label:cfg.data[k].name, data:cfg.data[k][cfg.volKey],
      backgroundColor:cfg.data[k].color, borderRadius:3, barPercentage:.7 }));
    mix.update();
  }

  function insight(){ document.getElementById('insightBar').innerHTML = `<b>Insight</b>${cfg.insights[S.metric]}`; }
  function all(){ kpis(); mainR(); mixR(); insight(); }

  document.querySelectorAll('.toggles button[data-g]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.toggles button[data-g]').forEach(x=>x.setAttribute('aria-pressed','false'));
    b.setAttribute('aria-pressed','true'); S.g=b.dataset.g; all();
  }));
  document.querySelectorAll('.metric-row .metric').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.metric-row .metric').forEach(x=>x.setAttribute('aria-pressed','false'));
    b.setAttribute('aria-pressed','true'); S.metric=b.dataset.m; kpis(); mainR(); insight();
  }));
  all();
}
