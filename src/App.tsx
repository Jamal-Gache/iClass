import { useState, useEffect, useCallback } from 'react';
import type { SimData, Lang, Ethnicity, ModalType, SimNode } from './types';
import Header from './components/Header';
import LeftRail from './components/LeftRail';
import Footer from './components/Footer';
import SetupSlide from './components/SetupSlide';
import ContextSlide from './components/ContextSlide';
import TextImageSlide from './components/TextImageSlide';
import VideoSlide from './components/VideoSlide';
import DecisionSlide from './components/DecisionSlide';
import OutcomeSlide from './components/OutcomeSlide';
import SummarySlide from './components/SummarySlide';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import ModalBackdrop from './components/ModalBackdrop';

const PROGRESS: Record<string, number> = {
  setup: 0, context: 16, text_image: 33, video: 50,
  decision: 67, outcome_a: 83, outcome_b: 83, summary: 100,
};

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [ethnicity, setEthnicity] = useState<Ethnicity>('black');
  const [simData, setSimData] = useState<SimData | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('setup');
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testErr, setTestErr] = useState(false);
  const [timerSecs, setTimerSecs] = useState(0);
  const [captionsOn, setCaptionsOn] = useState(true);

  // Timer
  useEffect(() => {
    if (currentNodeId === 'setup') { setTimerSecs(0); return; }
    const id = setInterval(() => setTimerSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [currentNodeId === 'setup']);

  const startSimulation = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (testErr) {
      setLoading(false);
      setError('Simulated error — test mode active.');
      return;
    }
    try {
      const r = await fetch(`/api/simulation?lang=${lang}&ethnicity=${ethnicity}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: SimData = await r.json();
      setSimData(data);
      setCurrentNodeId(data.start_node_id);
      setHistoryStack([]);
      setChosenId(null);
      setTimerSecs(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [lang, ethnicity, testErr]);

  const goNext = useCallback(() => {
    if (!simData) return;
    const node = simData.nodes[currentNodeId];
    if (!node || !node.next_node_id) return;
    setHistoryStack(h => [...h, currentNodeId]);
    setCurrentNodeId(node.next_node_id);
  }, [simData, currentNodeId]);

  const goBack = useCallback(() => {
    if (historyStack.length === 0) {
      setCurrentNodeId('setup');
      setSimData(null);
      setChosenId(null);
      return;
    }
    setHistoryStack(h => {
      const next = [...h];
      const prev = next.pop()!;
      setCurrentNodeId(prev);
      return next;
    });
  }, [historyStack]);

  const chooseOption = useCallback((targetNodeId: string, choiceId: string) => {
    setHistoryStack(h => [...h, currentNodeId]);
    setChosenId(choiceId);
    setCurrentNodeId(targetNodeId);
  }, [currentNodeId]);

  const restart = useCallback(() => {
    setCurrentNodeId('setup');
    setSimData(null);
    setChosenId(null);
    setHistoryStack([]);
    setTimerSecs(0);
  }, []);

  const isSetup = currentNodeId === 'setup';
  const progress = PROGRESS[currentNodeId] ?? 0;
  const ui = simData?.ui;
  const currentNode: SimNode | null = simData?.nodes[currentNodeId] ?? null;

  // keyboard A/B on decision node
  useEffect(() => {
    if (!currentNode || currentNode.type !== 'decision') return;
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const choice = currentNode.choices.find(c => c.id === key);
      if (choice) chooseOption(choice.target_node_id, choice.id);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentNode, chooseOption]);

  const showBack = !isSetup && !loading && !error;
  const showNext = !isSetup && !loading && !error && currentNode?.type !== 'decision' && currentNode?.type !== 'summary' && currentNode?.next_node_id != null;

  return (
    <div id="app" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header
        simTitle={ui?.sim_title ?? 'Leadership Decision Simulation'}
        progress={progress}
        slideLabel={isSetup ? 'Setup' : currentNode?.step_badge ?? ''}
        timerSecs={timerSecs}
        lang={isSetup ? null : lang.toUpperCase()}
        ethnicity={isSetup ? null : (ethnicity === 'black' ? 'Black' : 'East Asian')}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftRail
          onBrief={() => setModal('brief')}
          onCast={() => setModal('cast')}
          onHelp={() => setModal('help')}
          onReset={restart}
          onToggleTestErr={() => setTestErr(t => !t)}
          testErr={testErr}
          briefTip={ui?.rail_brief_tip ?? 'Brief'}
          castTip={ui?.rail_cast_tip ?? 'Cast'}
          helpTip={ui?.rail_help_tip ?? 'Help'}
        />

        <main className="stage" style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
          {loading && <LoadingState />}
          {!loading && error && (
            <ErrorState
              title={ui?.sim_error_title ?? 'Failed to load simulation'}
              body={error}
              retryLabel={ui?.retry_btn ?? 'Retry'}
              onRetry={startSimulation}
            />
          )}
          {!loading && !error && isSetup && (
            <SetupSlide
              lang={lang}
              ethnicity={ethnicity}
              onLangChange={setLang}
              onEthnicityChange={setEthnicity}
              onStart={startSimulation}
            />
          )}
          {!loading && !error && !isSetup && currentNode?.type === 'context' && (
            <ContextSlide node={currentNode} />
          )}
          {!loading && !error && !isSetup && currentNode?.type === 'text_image' && simData && (
            <TextImageSlide node={currentNode} photoUrl={simData.media.photo} photoAlt={currentNode.character_alt} />
          )}
          {!loading && !error && !isSetup && currentNode?.type === 'video' && simData && (
            <VideoSlide
              node={currentNode}
              videoUrl={simData.media.video_template.replace('{lang}', lang)}
              captionsUrl={`/assets/captions_${lang}.vtt`}
              captionsOn={captionsOn}
              onToggleCaptions={() => setCaptionsOn(c => !c)}
            />
          )}
          {!loading && !error && !isSetup && currentNode?.type === 'decision' && (
            <DecisionSlide node={currentNode} chosenId={chosenId} onChoose={chooseOption} />
          )}
          {!loading && !error && !isSetup && currentNode?.type === 'outcome' && (
            <OutcomeSlide node={currentNode} />
          )}
          {!loading && !error && !isSetup && currentNode?.type === 'summary' && simData && (
            <SummarySlide
              node={currentNode}
              chosenNode={chosenId ? (simData.nodes[chosenId === 'A' ? 'outcome_a' : 'outcome_b'] as import('./types').OutcomeNode) : null}
              optionLabel={ui?.option_label ?? 'Option'}
              restartLabel={ui?.restart_btn ?? 'Restart Simulation'}
              onRestart={restart}
            />
          )}
        </main>
      </div>

      <Footer
        showBack={showBack}
        showNext={showNext}
        backLabel={ui?.back_btn ?? 'Back'}
        nextLabel={ui?.next_btn ?? 'Next'}
        onBack={goBack}
        onNext={goNext}
        currentNodeId={currentNodeId}
        totalNodes={simData ? Object.keys(simData.nodes).length : 0}
      />

      {modal && (
        <ModalBackdrop onClose={() => setModal(null)}>
          {modal === 'brief' && ui && (
            <div className="modal-panel modal-enter" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', maxWidth: 480, padding: 28, zIndex: 50 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--purple)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>{ui.brief_scenario_label}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>{ui.brief_scenario_body}</p>
                </div>
                <button onClick={() => setModal(null)} className="rail-btn" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="callout" style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--purple)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>{ui.brief_objective_label}</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>{ui.brief_objective_body}</p>
              </div>
            </div>
          )}
          {modal === 'cast' && (
            <div id="modal-cast" className="modal-panel modal-enter" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', maxWidth: 320, overflow: 'hidden', zIndex: 50 }}>
              <div style={{ position: 'relative', padding: '24px 24px 60px', background: 'linear-gradient(135deg,#1e293b,#0f172a)' }}>
                <button onClick={() => setModal(null)} className="rail-btn" style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#C4B5FD', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>{ui?.cast_panel_label ?? 'Cast'}</p>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{ui?.cast_panel_subtitle ?? 'Featured Character'}</p>
              </div>
              <div style={{ marginTop: -48, padding: '0 24px 24px' }}>
                <div className="char-card" style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: '3px solid var(--border)', background: 'var(--surface2)', marginBottom: 14 }}>
                  {simData?.media.photo && <img src={simData.media.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={ui?.cast_panel_subtitle ?? ''} onError={e => (e.currentTarget.style.display = 'none')} />}
                </div>
                <p id="cast-name" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 3px' }}>
                  {simData ? (simData.nodes['text_image'] as import('./types').TextImageNode)?.character_name : 'Jordan Chen'}
                </p>
                <p id="cast-role" style={{ fontSize: 12, color: 'var(--text-3)', margin: '0 0 14px' }}>
                  {simData ? (simData.nodes['text_image'] as import('./types').TextImageNode)?.character_title : 'VP of Digital Learning'}
                </p>
                <div className="callout">
                  <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{ui?.cast_panel_body ?? ''}</p>
                </div>
              </div>
            </div>
          )}
          {modal === 'help' && ui && (
            <div id="modal-help" className="modal-panel modal-enter" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', maxWidth: 420, padding: 28, zIndex: 50 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>{ui.help_panel_title}</h3>
                <button onClick={() => setModal(null)} className="rail-btn" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {[{ t: ui.help_safe_title, b: ui.help_safe_body }, { t: ui.help_no_right_title, b: ui.help_no_right_body }, { t: ui.help_replay_title, b: ui.help_replay_body }].map(({ t, b }) => (
                <div key={t} className="callout" style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 4px' }}>{t}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>{b}</p>
                </div>
              ))}
            </div>
          )}
        </ModalBackdrop>
      )}
    </div>
  );
}
