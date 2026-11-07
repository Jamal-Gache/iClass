interface FooterProps {
  showBack: boolean;
  showNext: boolean;
  backLabel: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  currentNodeId: string;
  totalNodes: number;
}

const NODE_ORDER = ['context', 'text_image', 'video', 'decision', 'outcome_a', 'outcome_b', 'summary'];
const DOT_NODES  = ['context', 'text_image', 'video', 'decision', 'summary'];

export default function Footer({ showBack, showNext, backLabel, nextLabel, onBack, onNext, currentNodeId }: FooterProps) {
  return (
    <footer className="footer-bar" style={{ height: 64, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{ width: 120 }}>
        {showBack && (
          <button id="back-btn" onClick={onBack} className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <span id="back-btn-text">{backLabel}</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {DOT_NODES.map((id, i) => {
          const idx = NODE_ORDER.indexOf(currentNodeId);
          const dotIdx = NODE_ORDER.indexOf(id);
          const active = id === currentNodeId || (currentNodeId === 'outcome_a' && id === 'summary') || (currentNodeId === 'outcome_b' && id === 'summary');
          const past = dotIdx < idx;
          return (
            <div
              key={i}
              className="dot"
              style={{
                width: active ? 20 : 8,
                height: 8,
                background: active ? 'var(--purple)' : past ? '#C4B5FD' : 'var(--border2)',
              }}
            />
          );
        })}
      </div>

      <div style={{ width: 120, display: 'flex', justifyContent: 'flex-end' }}>
        {showNext && (
          <button id="next-btn" onClick={onNext} className="btn-primary">
            <span id="next-btn-text">{nextLabel}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}
      </div>
    </footer>
  );
}
