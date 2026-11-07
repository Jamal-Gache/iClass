import type { ContextNode } from '../types';

export default function ContextSlide({ node }: { node: ContextNode }) {
  return (
    <div className="main-card slide-enter" style={{ maxWidth: 760, width: '100%', padding: 48 }}>
      <span id="ctx-badge" className="step-badge" style={{ marginBottom: 20, display: 'inline-block' }}>{node.step_badge}</span>
      <h2 id="ctx-title" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 16px', letterSpacing: '-0.3px' }}>{node.title}</h2>
      <p id="ctx-body" style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 28px' }}>{node.body}</p>
      <div className="callout purple-rule">
        <p id="ctx-objective-label" style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px' }}>{node.learning_objective_label}</p>
        <p id="ctx-objective" style={{ fontSize: 14, color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>{node.learning_objective_body}</p>
      </div>
    </div>
  );
}
