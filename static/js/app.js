// ════════════════════════════════════
// STATE
// ════════════════════════════════════
const S = {
  slide: 'setup',
  lang: 'en',
  ethnicity: 'black',
  choice: null,
  data: null,
  timerSecs: 0,
  timerInterval: null,
  captionsOn: true,
  testErr: false,
};

const PROGRESS = {
  setup: 0, context: 16, text_image: 33, video: 50,
  decision: 67, outcome_a: 83, outcome_b: 83, summary: 100,
};

// ════════════════════════════════════
// MOCK DATA (fallback when API unavailable)
// ════════════════════════════════════
const MOCK = {
  en: {
    slides: {
      context:    { step_badge:'1 Context', title:'A new customer opportunity', body:'You lead SchoolSims. A college requests a new feature before signing. Your team has limited capacity. Your learning objective is to weigh near-term revenue against delivery capacity and customer trust.' },
      text_image: { step_badge:'2 Text and image', title:'The customer request', body:'The college wants the feature in four weeks. Your developers already have commitments.', character_name:'Jordan Chen', character_title:'VP of Digital Learning', character_alt:'Portrait of Jordan Chen' },
      video:      { step_badge:'3 Video', quote:'Can we commit to four weeks?' },
      decision:   { step_badge:'4 Decision', prompt:'What will you do?', option_a:'A Commit to the deadline', option_b:'B Propose a phased pilot' },
      outcome_a:  { step_badge:'5A Outcome A', title:'Delivery pressure', body:'The customer agrees. Your team must renegotiate existing commitments.' },
      outcome_b:  { step_badge:'5B Outcome B', title:'A smaller first step', body:'The customer reviews a limited pilot with an agreed scope and timeline.' },
      summary:    { step_badge:'6 Summary', title:'Reflect on your decision', question:'How did your choice balance revenue, capacity and trust?' },
    },
    ui: { start_btn:'Start Simulation', back_btn:'Back', next_btn:'Next', restart_btn:'Restart Simulation', lang_label:'Language', eth_label:'Character Ethnicity', sim_title:'Leadership Decision Simulation' },
  },
  es: {
    slides: {
      context:    { step_badge:'1 Contexto', title:'Una nueva oportunidad de cliente', body:'Lideras SchoolSims. Una universidad solicita una nueva función antes de firmar. Tu equipo tiene capacidad limitada. Tu objetivo de aprendizaje es sopesar los ingresos a corto plazo frente a la capacidad de entrega y la confianza del cliente.' },
      text_image: { step_badge:'2 Texto e imagen', title:'La solicitud del cliente', body:'La universidad quiere la función en cuatro semanas. Tus desarrolladores ya tienen compromisos.', character_name:'Jordan Chen', character_title:'VP de Aprendizaje Digital', character_alt:'Retrato de Jordan Chen' },
      video:      { step_badge:'3 Video', quote:'¿Podemos comprometernos a cuatro semanas?' },
      decision:   { step_badge:'4 Decisión', prompt:'¿Qué harás?', option_a:'A Comprometerse con la fecha límite', option_b:'B Proponer un piloto por fases' },
      outcome_a:  { step_badge:'5A Resultado A', title:'Presión de entrega', body:'El cliente acepta. Tu equipo debe renegociar los compromisos existentes.' },
      outcome_b:  { step_badge:'5B Resultado B', title:'Un primer paso más pequeño', body:'El cliente revisa un piloto limitado con un alcance y cronograma acordados.' },
      summary:    { step_badge:'6 Resumen', title:'Reflexiona sobre tu decisión', question:'¿Cómo equilibró tu elección los ingresos, la capacidad y la confianza?' },
    },
    ui: { start_btn:'Iniciar simulación', back_btn:'Atrás', next_btn:'Siguiente', restart_btn:'Reiniciar simulación', lang_label:'Idioma', eth_label:'Etnia del personaje', sim_title:'Simulación de Decisión de Liderazgo' },
  },
};

// ════════════════════════════════════
// HELPERS
// ════════════════════════════════════
function ui(k)    { return (S.data?.ui    || MOCK[S.lang].ui)[k]    || ''; }
function sl(k)    { return (S.data?.slides || MOCK[S.lang].slides)[k] || {}; }
function media(t) {
  if (S.data?.media) return S.data.media[t];
  const m = { photo:`/static/${S.ethnicity}_photo.jpg`, video:`/static/${S.ethnicity}_${S.lang}.mp4`, captions:`/static/captions_${S.lang}.vtt` };
  return m[t] || '';
}

function $  (id) { return document.getElementById(id); }
function set(id, v) { const e = $(id); if (e) e.textContent = v ?? ''; }
function htm(id, v) { const e = $(id); if (e) e.innerHTML  = v ?? ''; }
function show(id)   { $(id)?.classList.remove('hidden'); }
function hide(id)   { $(id)?.classList.add('hidden'); }
function flex(id)   { const e=$(id); if(e){ e.classList.remove('hidden'); e.style.display='flex'; } }

// ════════════════════════════════════
// TIMER
// ════════════════════════════════════
function startTimer() {
  clearInterval(S.timerInterval);
  S.timerSecs = 0;
  S.timerInterval = setInterval(() => {
    S.timerSecs++;
    const m = String(Math.floor(S.timerSecs/60)).padStart(2,'0');
    const s = String(S.timerSecs%60).padStart(2,'0');
    set('timer', `${m}:${s}`);
  }, 1000);
}
function stopTimer() { clearInterval(S.timerInterval); set('timer','00:00'); }

// ════════════════════════════════════
// PROGRESS + DOTS
// ════════════════════════════════════
function updateProgress() {
  const pct = PROGRESS[S.slide] ?? 0;
  $('progress-fill').style.width = pct + '%';
  set('hdr-pct', `${pct}% COMPLETE`);
  const labels = { setup:'SETUP', context:'SLIDE 1', text_image:'SLIDE 2', video:'SLIDE 3', decision:'SLIDE 4', outcome_a:'SLIDE 5A', outcome_b:'SLIDE 5B', summary:'SLIDE 6' };
  set('hdr-slide-label', labels[S.slide]||'');
  renderDots();
}

function renderDots() {
  const steps = ['context','text_image','video','decision','outcome','summary'];
  const cur = ['outcome_a','outcome_b'].includes(S.slide) ? 4 : steps.indexOf(S.slide);
  if (S.slide === 'setup') { htm('dot-nav',''); return; }
  $('dot-nav').innerHTML = steps.map((_,i) =>
    `<div class="dot" style="border-radius:9999px;${i===cur?'background:var(--gold);width:14px;height:6px':i<cur?'background:rgba(201,166,83,0.3);width:6px;height:6px':'background:var(--border2);width:6px;height:6px'}"></div>`
  ).join('');
}

// ════════════════════════════════════
// SLIDE MANAGEMENT
// ════════════════════════════════════
const ALL_SLIDES = ['setup','context','text-image','video','decision','outcome-a','outcome-b','summary'];

function switchTo(id) {
  ALL_SLIDES.forEach(s => hide(`slide-${s}`));
  const el = $(`slide-${id}`);
  if (el) { show(`slide-${el.id.replace('slide-','')}`); el.classList.add('slide-enter'); setTimeout(()=>el.classList.remove('slide-enter'),350); }
  updateProgress();
}

function navSetup(showBack, showNext) {
  const bb = $('back-btn'), nb = $('next-btn');
  if (showBack) { bb.style.display='flex'; bb.classList.remove('hidden'); set('back-btn-text', ui('back_btn')); }
  else          { bb.style.display='none'; }
  if (showNext) { nb.style.display='flex'; nb.classList.remove('hidden'); set('next-btn-text', ui('next_btn')); }
  else          { nb.style.display='none'; }
}

// ════════════════════════════════════
// RENDER EACH SLIDE
// ════════════════════════════════════
function renderSetup() {
  S.slide='setup'; S.choice=null; S.data=null;
  switchTo('setup');
  set('setup-title', 'Leadership Decision Simulation');
  set('setup-start-btn', 'Start Simulation');
  set('setup-lang-label', 'Language');
  set('setup-eth-label', 'Character Ethnicity');
  set('hdr-sim-title', 'Leadership Simulation');
  hide('badge-lang'); hide('badge-eth');
  navSetup(false, false);
  stopTimer();
}

function renderContext() {
  S.slide='context';
  const d = sl('context');
  switchTo('context');
  set('ctx-badge', d.step_badge);
  set('ctx-title', d.title);
  set('ctx-body',  d.body);
  navSetup(true, true);
}

function renderTextImage() {
  S.slide='text_image';
  const d = sl('text_image');
  switchTo('text-image');
  set('ti-badge', d.step_badge);
  set('ti-title', d.title);
  set('ti-body',  d.body);
  set('char-name', d.character_name||'Jordan Chen');
  set('char-role', d.character_title||'VP of Digital Learning');
  set('cast-name', d.character_name||'Jordan Chen');
  set('cast-role', d.character_title||'VP of Digital Learning');
  loadChar();
  navSetup(true, true);
}

function renderVideo() {
  S.slide='video';
  const d = sl('video');
  switchTo('video');
  set('vid-badge', d.step_badge);
  set('vid-quote', d.quote);
  loadVid();
  navSetup(true, true);
}

function renderDecision() {
  S.slide='decision'; S.choice=null;
  const d = sl('decision');
  switchTo('decision');
  set('dec-badge',  d.step_badge);
  set('dec-prompt', d.prompt);
  set('dec-opt-a',  d.option_a);
  set('dec-opt-b',  d.option_b);
  $('choice-a').classList.remove('selected');
  $('choice-b').classList.remove('selected');
  navSetup(true, false);
}

function renderOutcome() {
  const isA = S.choice==='A';
  S.slide = isA ? 'outcome_a' : 'outcome_b';
  const key = isA ? 'outcome_a' : 'outcome_b';
  const id  = isA ? 'outcome-a' : 'outcome-b';
  const d = sl(key);
  switchTo(id);
  set(isA?'oa-badge':'ob-badge', d.step_badge);
  set(isA?'oa-title':'ob-title', d.title);
  set(isA?'oa-body' :'ob-body',  d.body);
  navSetup(true, true);
}

function renderSummary() {
  S.slide='summary';
  const d = sl('summary');
  const isA = S.choice==='A';
  const od = sl(isA?'outcome_a':'outcome_b');
  switchTo('summary');
  set('sum-badge',   d.step_badge);
  set('sum-title',   d.title);
  set('sum-question',d.question);
  set('sum-restart-btn', ui('restart_btn'));

  htm('sum-recap', `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      <span style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;background:rgba(201,166,83,0.12);color:var(--gold);border:1px solid var(--gold-dim);padding:3px 10px;border-radius:4px;">Option ${S.choice}</span>
      <span style="font-size:14px;font-weight:600;color:var(--text-1);">${od.title||''}</span>
    </div>
    <p style="font-size:14px;color:var(--text-2);line-height:1.65;margin:0;">${od.body||''}</p>
  `);
  navSetup(true, false);
}

// ════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════
function goNext() {
  switch(S.slide) {
    case 'context':    renderTextImage(); break;
    case 'text_image': renderVideo();     break;
    case 'video':      renderDecision();  break;
    case 'decision':   if(S.choice) renderOutcome(); break;
    case 'outcome_a':
    case 'outcome_b':  renderSummary();   break;
  }
}

function goBack() {
  switch(S.slide) {
    case 'context':    renderSetup();     break;
    case 'text_image': renderContext();   break;
    case 'video':      renderTextImage(); break;
    case 'decision':   renderVideo();     break;
    case 'outcome_a':
    case 'outcome_b':  renderDecision();  break;
    case 'summary':    renderOutcome();   break;
  }
}

function goToSetup() { closeModal(); renderSetup(); }
function confirmReset() { if(confirm('Reset the simulation?')) goToSetup(); }

// ════════════════════════════════════
// START SIMULATION
// ════════════════════════════════════
async function startSimulation() {
  hide('main-card'); show('loading-state');

  try {
    const r = await fetch(`/api/simulation?lang=${S.lang}&ethnicity=${S.ethnicity}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    S.data = await r.json();
  } catch(e) {
    S.data = null;
    console.warn('API unavailable — using mock data:', e.message);
  }

  hide('loading-state'); show('main-card');

  set('hdr-sim-title', ui('sim_title'));
  const bl = $('badge-lang'); bl.textContent = S.lang === 'en' ? 'EN' : 'ES'; bl.classList.remove('hidden');
  const be = $('badge-eth');  be.textContent = S.ethnicity === 'black' ? 'BLACK' : 'EAST ASIAN'; be.classList.remove('hidden');

  startTimer();
  renderContext();
}

// ════════════════════════════════════
// DECISION
// ════════════════════════════════════
function selectChoice(c) {
  S.choice = c;
  $('choice-a').classList.toggle('selected', c==='A');
  $('choice-b').classList.toggle('selected', c==='B');
  flex('next-btn'); set('next-btn-text', ui('next_btn'));
}

// ════════════════════════════════════
// MEDIA — CHARACTER IMAGE
// ════════════════════════════════════
function loadChar() {
  hide('char-error');
  hide('char-img');
  show('char-skeleton');
  if (S.testErr) { setTimeout(onCharError, 600); return; }
  const src = media('photo');
  $('char-img').src = src;
  if ($('cast-img')) $('cast-img').src = src;
}
function onCharLoad()  { hide('char-skeleton'); hide('char-error'); show('char-img'); }
function onCharError() { hide('char-skeleton'); hide('char-img'); $('char-error').style.display='flex'; }
function retryChar()   { loadChar(); }

// ════════════════════════════════════
// MEDIA — VIDEO
// ════════════════════════════════════
function loadVid() {
  $('vid-error').style.display='none'; hide('sim-video'); show('vid-skeleton');
  if (S.testErr) { setTimeout(onVidError, 800); return; }
  const v = $('sim-video'), t = $('vid-track');
  v.src = media('video');
  t.src = media('captions');
  t.label = S.lang==='en' ? 'English' : 'Español';
  t.srclang = S.lang;
}
function onVidLoad()  { hide('vid-skeleton'); $('vid-error').style.display='none'; show('sim-video'); }
function onVidError() { hide('vid-skeleton'); hide('sim-video'); $('vid-error').style.display='flex'; }
function retryVid()   { loadVid(); }

// ════════════════════════════════════
// CAPTIONS TOGGLE
// ════════════════════════════════════
function toggleCaptions() {
  S.captionsOn = !S.captionsOn;
  const v = $('sim-video');
  if (v && v.textTracks.length > 0) v.textTracks[0].mode = S.captionsOn ? 'showing' : 'hidden';
  $('caption-btn').style.color = S.captionsOn ? 'var(--gold)' : '';
}

// ════════════════════════════════════
// TEST ERROR MODE
// ════════════════════════════════════
function toggleTestErr() {
  S.testErr = !S.testErr;
  const btn = $('test-err-btn');
  btn.textContent = S.testErr ? 'ERROR ON' : 'TEST ERROR';
  btn.style.background = S.testErr ? 'rgba(185,28,28,0.9)' : 'rgba(20,20,23,0.9)';
  btn.style.color = S.testErr ? '#fff' : '';
  if (S.slide==='text_image') loadChar();
  if (S.slide==='video')      loadVid();
}

// ════════════════════════════════════
// MODALS
// ════════════════════════════════════
function openModal(type) {
  $('modal-backdrop').style.display = 'block';
  const m = $(`modal-${type}`);
  if (!m) return;
  show(`modal-${type}`);
  m.classList.add('modal-enter');
  setTimeout(() => m.classList.remove('modal-enter'), 300);
}
function closeModal() {
  $('modal-backdrop').style.display = 'none';
  ['brief','cast','help'].forEach(t => hide(`modal-${t}`));
}

// ════════════════════════════════════
// KEYBOARD SHORTCUTS
// ════════════════════════════════════
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'SELECT') return;
  if (e.key==='a' || e.key==='A') { if(S.slide==='decision') selectChoice('A'); }
  if (e.key==='b' || e.key==='B') { if(S.slide==='decision') selectChoice('B'); }
  if (e.key==='ArrowRight') { if(S.slide!=='setup' && S.slide!=='summary') goNext(); }
  if (e.key==='ArrowLeft')  { if(S.slide!=='setup') goBack(); }
  if (e.key==='Escape') closeModal();
});

// ════════════════════════════════════
// INIT
// ════════════════════════════════════
document.addEventListener('DOMContentLoaded', renderSetup);
