import type { SummaryNode, OutcomeNode } from '../types';

interface Props {
  node: SummaryNode;
  chosenNode: OutcomeNode | null;
  optionLabel: string;
  restartLabel: string;
  onRestart: () => void;
}

export default function SummarySlide({ node, chosenNode, optionLabel, restartLabel, onRestart }: Props) {
  return (
    <div className="main-card slide-enter" style={{ maxWidth: 1020, width: '100%', padding: 60 }}>
      <span className="step-badge" style={{ marginBottom: 20, display: 'inline-block' }}>{node.step_badge}</span>
      <h2 id="sum-title" style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 24px', letterSpacing: '-0.3px' }}>{node.title}</h2>

      {chosenNode && (
        <div id="sum-recap" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="step-badge">{optionLabel} {chosenNode.you_chose.slice(-1)}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{chosenNode.title}</span>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>{chosenNode.body}</p>
        </div>
      )}

      <div className="callout" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(107,70,193,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>{node.reflection_prompt_label}</p>
            <p style={{ fontSize: 15, color: 'var(--text-1)', margin: 0, lineHeight: 1.6 }}>{node.question}</p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button id="sum-restart-btn" onClick={onRestart} className="btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>
          {restartLabel}
        </button>
      </div>
    </div>
  );
}
