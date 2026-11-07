import type { DecisionNode } from '../types';

interface Props {
  node: DecisionNode;
  chosenId: string | null;
  onChoose: (targetNodeId: string, choiceId: string) => void;
}

export default function DecisionSlide({ node, chosenId, onChoose }: Props) {
  return (
    <div className="main-card slide-enter" style={{ maxWidth: 760, width: '100%', padding: 48 }}>
      <span id="dec-badge" className="step-badge" style={{ marginBottom: 20, display: 'inline-block' }}>{node.step_badge}</span>
      <h2 id="dec-prompt" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 6px', letterSpacing: '-0.3px' }}>{node.prompt}</h2>
      <p id="dec-kbd-hint" style={{ fontSize: 12, color: 'var(--text-3)', margin: '0 0 28px' }}>{node.keyboard_hint}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {node.choices.map(choice => (
          <button
            key={choice.id}
            id={`choice-${choice.id.toLowerCase()}`}
            onClick={() => onChoose(choice.target_node_id, choice.id)}
            className={`choice-card${chosenId === choice.id ? ' selected' : ''}`}
            data-letter={choice.id}
            style={{ textAlign: 'left', padding: 24 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <span className="choice-letter" style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{choice.id}</span>
              <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-3)', background: 'var(--surface2)', border: '1px solid var(--border2)', padding: '2px 7px', borderRadius: 4, fontFamily: "'DM Mono', monospace" }}>[{choice.id}]</span>
            </div>
            <p id={`dec-opt-${choice.id.toLowerCase()}`} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.5, margin: 0 }}>{choice.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
