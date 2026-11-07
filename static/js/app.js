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
// MOCK DATA (UI strings only — used before API call)
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
    ui: {
      start_btn:'Start Simulation', back_btn:'Back', next_btn:'Next', restart_btn:'Restart Simulation',
      lang_label:'Language', eth_label:'Character Ethnicity', sim_title:'Leadership Decision Simulation',
      setup_subtitle:'Experience realistic leadership scenarios and develop critical decision-making skills in a safe, reflective environment.',
      before_you_begin_title:'Before You Begin',
      before_you_begin_body:"This is a safe environment to practice. There's no single right answer — explore both paths to understand the full range of trade-offs.",
      learning_objective_label:'Learning Objective',
      learning_objective_body:'Weigh near-term revenue against delivery capacity and customer trust.',
      ti_point1:'4-week delivery timeline requested', ti_point2:'Development team already at capacity',
      watch_listen_title:'Watch & Listen', watch_listen_body:"Pay attention to the customer's urgency. It shapes the decision pressure you'll feel on the next slide.",
      keyboard_hint:'Press [A] or [B] to decide',
      you_chose_a:'You chose A', you_chose_b:'You chose B', option_label:'Option', reflection_prompt_label:'Reflection Prompt',
      revenue:'Revenue', capacity:'Capacity', trust:'Trust',
      oa_revenue_body:'Near-term deal secured with the college', oa_capacity_body:'Team overextended, commitments renegotiated', oa_trust_body:'At risk if delivery slips under pressure',
      ob_revenue_body:'Slower to close — pilot first, full deal later', ob_capacity_body:'Existing commitments preserved', ob_trust_body:'Transparent expectation-setting builds trust',
      sim_error_title:'Failed to load simulation', sim_error_body:'Could not connect to the simulation service. Please check your connection and try again.', retry_btn:'Retry',
      brief_scenario_label:'Scenario', brief_scenario_body:'You lead SchoolSims. A college requests a new feature before signing. Your team has limited capacity.',
      brief_objective_label:'Learning Objective', brief_objective_body:'Weigh near-term revenue against delivery capacity and customer trust.',
      cast_panel_label:'Cast', cast_panel_subtitle:'Featured Character', cast_panel_body:"This character represents the external stakeholder in your scenario. Their decisions shape the outcomes you'll experience.",
      help_panel_title:'Before You Begin', help_safe_title:'Safe Environment', help_safe_body:'No decisions here affect real outcomes. Practice freely.',
      help_no_right_title:'No Single Right Answer', help_no_right_body:'Both options involve real trade-offs. Reflect on your reasoning.',
      help_replay_title:'Play Multiple Times', help_replay_body:'Try both paths to understand the full range of consequences.',
    },
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
    ui: {
      start_btn:'Iniciar simulación', back_btn:'Atrás', next_btn:'Siguiente', restart_btn:'Reiniciar simulación',
      lang_label:'Idioma', eth_label:'Etnia del personaje', sim_title:'Simulación de Decisión de Liderazgo',
      setup_subtitle:'Experimenta escenarios de liderazgo realistas y desarrolla habilidades críticas de toma de decisiones en un entorno seguro y reflexivo.',
      before_you_begin_title:'Antes de comenzar',
      before_you_begin_body:'Este es un entorno seguro para practicar. No hay una sola respuesta correcta — explora ambos caminos para comprender toda la gama de compensaciones.',
      learning_objective_label:'Objetivo de aprendizaje',
      learning_objective_body:'Sopesar los ingresos a corto plazo frente a la capacidad de entrega y la confianza del cliente.',
      ti_point1:'Plazo de entrega de 4 semanas solicitado', ti_point2:'El equipo de desarrollo ya está a plena capacidad',
      watch_listen_title:'Mira y escucha', watch_listen_body:'Presta atención a la urgencia del cliente. Determinará la presión de decisión que sentirás en la siguiente diapositiva.',
      keyboard_hint:'Presiona [A] o [B] para decidir',
      you_chose_a:'Elegiste A', you_chose_b:'Elegiste B', option_label:'Opción', reflection_prompt_label:'Pregunta de reflexión',
      revenue:'Ingresos', capacity:'Capacidad', trust:'Confianza',
      oa_revenue_body:'Acuerdo a corto plazo asegurado con la universidad', oa_capacity_body:'Equipo sobrecargado, compromisos renegociados', oa_trust_body:'En riesgo si la entrega se retrasa bajo presión',
      ob_revenue_body:'Más lento de cerrar — primero el piloto, luego el acuerdo completo', ob_capacity_body:'Los compromisos existentes se mantienen', ob_trust_body:'Establecer expectativas transparentes genera confianza',
      sim_error_title:'Error al cargar la simulación', sim_error_body:'No se pudo conectar al servicio de simulación. Verifica tu conexión e inténtalo de nuevo.', retry_btn:'Reintentar',
      brief_scenario_label:'Escenario', brief_scenario_body:'Lideras SchoolSims. Una universidad solicita una nueva función antes de firmar. Tu equipo tiene capacidad limitada.',
      brief_objective_label:'Objetivo de aprendizaje', brief_objective_body:'Sopesar los ingresos a corto plazo frente a la capacidad de entrega y la confianza del cliente.',
      cast_panel_label:'Reparto', cast_panel_subtitle:'Personaje destacado', cast_panel_body:'Este personaje representa al actor externo en tu escenario. Sus decisiones moldean los resultados que experimentarás.',
      help_panel_title:'Antes de comenzar', help_safe_title:'Entorno seguro', help_safe_body:'Las decisiones aquí no afectan resultados reales. Practica libremente.',
      help_no_right_title:'No hay una sola respuesta correcta', help_no_right_body:'Ambas opciones implican compensaciones reales. Reflexiona sobre tu razonamiento.',
      help_replay_title:'Juega varias veces', help_replay_body:'Prueba ambos caminos para comprender toda la gama de consecuencias.',
    },
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
  set('hdr-pct', `${pct}%`);
  const labels = { setup:'Setup', context:'Slide 1', text_image:'Slide 2', video:'Slide 3', decision:'Slide 4', outcome_a:'Slide 5A', outcome_b:'Slide 5B', summary:'Slide 6' };
  set('hdr-slide-label', labels[S.slide]||'');
  renderDots();
}

function renderDots() {
  const steps = ['context','text_image','video','decision','outcome','summary'];
  const cur = ['outcome_a','outcome_b'].includes(S.slide) ? 4 : steps.indexOf(S.slide);
  if (S.slide === 'setup') { htm('dot-nav',''); return; }
  $('dot-nav').innerHTML = steps.map((_,i) =>
    `<div class="dot" style="border-radius:9999px;${i===cur?'background:#6B46C1;width:16px;height:6px':i<cur?'background:#C4B5FD;width:6px;height:6px':'background:#CBD5E1;width:6px;height:6px'}"></div>`
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
// SETUP LOCALIZATION
// ════════════════════════════════════
function localizeSetup() {
  const u = MOCK[S.lang].ui;
  set('setup-lang-label',       u.lang_label);
  set('setup-eth-label',        u.eth_label);
  set('setup-start-btn',        u.start_btn);
  set('setup-title',            u.sim_title);
  set('setup-subtitle',         u.setup_subtitle);
  set('before-you-begin-title', u.before_you_begin_title);
  set('before-you-begin-body',  u.before_you_begin_body);
  const ti = MOCK[S.lang].slides.text_image;
  set('cast-name', ti.character_name);
  set('cast-role', ti.character_title);
  set('cast-panel-label',    u.cast_panel_label);
  set('cast-panel-subtitle', u.cast_panel_subtitle);
  set('cast-panel-body',     u.cast_panel_body);
}

function onLangChange(val) {
  S.lang = val;
  if (S.slide === 'setup') localizeSetup();
}

// ════════════════════════════════════
// CUSTOM SELECT DROPDOWNS
// ════════════════════════════════════
function toggleCsel(id) {
  const el = document.getElementById(id);
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.csel').forEach(c => c.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}
function pickLang(val, label) {
  document.getElementById('lang-csel-val').textContent = label;
  document.getElementById('lang-csel').classList.remove('open');
  document.querySelectorAll('#lang-csel .csel-opt').forEach(o => o.classList.toggle('selected', o.textContent === label));
  onLangChange(val);
}
function pickEth(val, label) {
  document.getElementById('eth-csel-val').textContent = label;
  document.getElementById('eth-csel').classList.remove('open');
  document.querySelectorAll('#eth-csel .csel-opt').forEach(o => o.classList.toggle('selected', o.textContent === label));
  S.ethnicity = val;
}
document.addEventListener('click', e => {
  if (!e.target.closest('.csel')) document.querySelectorAll('.csel').forEach(c => c.classList.remove('open'));
});

// ════════════════════════════════════
// RENDER EACH SLIDE
// ════════════════════════════════════
function renderSetup() {
  S.slide='setup'; S.choice=null; S.data=null;
  switchTo('setup');
  localizeSetup();
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
  set('ctx-objective-label', ui('learning_objective_label'));
  set('ctx-objective',       ui('learning_objective_body'));
  navSetup(true, true);
}

function renderTextImage() {
  S.slide='text_image';
  const d = sl('text_image');
  switchTo('text-image');
  set('ti-badge',  d.step_badge);
  set('ti-title',  d.title);
  set('ti-body',   d.body);
  set('ti-point1', ui('ti_point1'));
  set('ti-point2', ui('ti_point2'));
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
  set('vid-badge',              d.step_badge);
  set('vid-quote',              d.quote);
  set('vid-watch-listen-title', ui('watch_listen_title'));
  set('vid-watch-listen-body',  ui('watch_listen_body'));
  loadVid();
  navSetup(true, true);
}

function renderDecision() {
  S.slide='decision'; S.choice=null;
  const d = sl('decision');
  switchTo('decision');
  set('dec-badge',    d.step_badge);
  set('dec-prompt',   d.prompt);
  set('dec-opt-a',    d.option_a);
  set('dec-opt-b',    d.option_b);
  set('dec-kbd-hint', ui('keyboard_hint'));
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

  if (isA) {
    set('oa-badge',           d.step_badge);
    set('oa-chose-label',     ui('you_chose_a'));
    set('oa-title',           d.title);
    set('oa-body',            d.body);
    set('oa-revenue-label',   ui('revenue'));
    set('oa-revenue-body',    ui('oa_revenue_body'));
    set('oa-capacity-label',  ui('capacity'));
    set('oa-capacity-body',   ui('oa_capacity_body'));
    set('oa-trust-label',     ui('trust'));
    set('oa-trust-body',      ui('oa_trust_body'));
  } else {
    set('ob-badge',           d.step_badge);
    set('ob-chose-label',     ui('you_chose_b'));
    set('ob-title',           d.title);
    set('ob-body',            d.body);
    set('ob-revenue-label',   ui('revenue'));
    set('ob-revenue-body',    ui('ob_revenue_body'));
    set('ob-capacity-label',  ui('capacity'));
    set('ob-capacity-body',   ui('ob_capacity_body'));
    set('ob-trust-label',     ui('trust'));
    set('ob-trust-body',      ui('ob_trust_body'));
  }
  navSetup(true, true);
}

function renderSummary() {
  S.slide='summary';
  const d = sl('summary');
  const isA = S.choice==='A';
  const od = sl(isA?'outcome_a':'outcome_b');
  switchTo('summary');
  set('sum-badge',               d.step_badge);
  set('sum-title',               d.title);
  set('sum-reflection-label',    ui('reflection_prompt_label'));
  set('sum-question',            d.question);
  set('sum-restart-btn',         ui('restart_btn'));

  htm('sum-recap', `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      <span style="font-size:12px;font-weight:600;color:#6B46C1;background:rgba(107,70,193,0.08);border:1px solid rgba(107,70,193,0.25);padding:3px 10px;border-radius:20px;">${ui('option_label')} ${S.choice}</span>
      <span style="font-size:15px;font-weight:600;color:var(--text-1);">${od.title||''}</span>
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
  hide('main-card');
  hide('error-state');
  show('loading-state');

  // testErr mode: simulate API failure
  if (S.testErr) {
    hide('loading-state');
    showSimError('Simulated error — test mode active.');
    return;
  }

  try {
    const r = await fetch(`/api/simulation?lang=${S.lang}&ethnicity=${S.ethnicity}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    S.data = await r.json();
  } catch(e) {
    hide('loading-state');
    showSimError(e.message);
    return;
  }

  hide('loading-state');
  show('main-card');

  set('hdr-sim-title', ui('sim_title'));
  const langText = S.lang === 'en' ? 'EN' : 'ES';
  const ethText  = S.ethnicity === 'black' ? 'Black' : 'East Asian';
  const bl = $('badge-lang'); bl.textContent = langText; bl.classList.remove('hidden');
  const be = $('badge-eth');  be.textContent = ethText;  be.classList.remove('hidden');

  startTimer();
  renderContext();
}

function showSimError(msg) {
  hide('loading-state');
  hide('main-card');
  show('error-state');
  set('error-title',     MOCK[S.lang].ui.sim_error_title);
  set('error-msg',       msg || MOCK[S.lang].ui.sim_error_body);
  set('error-retry-btn', MOCK[S.lang].ui.retry_btn);
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
  $('caption-btn').style.color = S.captionsOn ? 'var(--purple)' : '';
}

// ════════════════════════════════════
// TEST ERROR MODE
// ════════════════════════════════════
function toggleTestErr() {
  S.testErr = !S.testErr;
  const btn = $('test-err-btn');
  btn.textContent = S.testErr ? '🔴 Error ON' : '🧪 Test Error';
  btn.style.background = S.testErr ? 'rgba(185,28,28,0.9)' : '';
  btn.style.color = S.testErr ? '#fff' : '';
  if (S.slide==='text_image') loadChar();
  if (S.slide==='video')      loadVid();
}

// ════════════════════════════════════
// MODALS
// ════════════════════════════════════
function openModal(type) {
  document.querySelectorAll('.csel').forEach(c => c.classList.remove('open'));
  $('modal-backdrop').style.display = 'block';
  const m = $(`modal-${type}`);
  if (!m) return;

  if (type === 'brief') {
    set('brief-scenario-label',   ui('brief_scenario_label'));
    set('brief-scenario-body',    ui('brief_scenario_body'));
    set('brief-objective-label',  ui('brief_objective_label'));
    set('brief-objective-body',   ui('brief_objective_body'));
  }
  if (type === 'cast') {
    set('cast-panel-label',    ui('cast_panel_label'));
    set('cast-panel-subtitle', ui('cast_panel_subtitle'));
    set('cast-panel-body',     ui('cast_panel_body'));
  }
  if (type === 'help') {
    set('help-panel-title',    ui('help_panel_title'));
    set('help-safe-title',     ui('help_safe_title'));
    set('help-safe-body',      ui('help_safe_body'));
    set('help-no-right-title', ui('help_no_right_title'));
    set('help-no-right-body',  ui('help_no_right_body'));
    set('help-replay-title',   ui('help_replay_title'));
    set('help-replay-body',    ui('help_replay_body'));
  }

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
