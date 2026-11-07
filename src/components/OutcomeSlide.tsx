import type { OutcomeNode, ImpactDirection } from '../types';

const IMPACT_STYLE: Record<ImpactDirection, { wrap: string; label: string; body: string; stroke: string; icon: string }> = {
  up:   { wrap: 'impact-up',   label: '#15803d', body: '#166534', stroke: '#16a34a', icon: 'M23 6l-9.5 9.5-5-5L1 18' },
  down: { wrap: 'impact-down', label: '#b91c1c', body: '#991b1b', stroke: '#dc2626', icon: 'M23 18l-9.5-9.5-5 5L1 6' },
  mid:  { wrap: 'impact-mid',  label: '#b45309', body: '#92400e', stroke: '#d97706', icon: 'M5 12h14' },
};

export default function OutcomeSlide({ node }: { node: OutcomeNode }) {
  return (
    <div className="main-card slide-enter" style={{ maxWidth: 760, width: '100%', padding: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span className="step-badge">{node.step_badge}</span>
        <span className="step-badge" style={{ background: 'rgba(107,70,193,0.08)', color: 'var(--purple)' }}>{node.you_chose}</span>
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 12px', letterSpacing: '-0.3px' }}>{node.title}</h2>
      <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 28px' }}>{node.body}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {node.impacts.map(impact => {
          const s = IMPACT_STYLE[impact.direction];
          return (
            <div key={impact.key} className={s.wrap} style={{ border: '1px solid', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.stroke} strokeWidth="2.5" strokeLinecap="round"><polyline points={s.icon}/></svg>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.label, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{impact.label}</span>
              </div>
              <p style={{ fontSize: 12, color: s.body, margin: 0, lineHeight: 1.5 }}>{impact.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
