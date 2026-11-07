import { useState } from 'react';
import type { Lang, Ethnicity } from '../types';

// Inline MOCK UI strings so Setup screen works before API call
const SETUP_UI: Record<Lang, { sim_title: string; setup_subtitle: string; before_you_begin_title: string; before_you_begin_body: string; lang_label: string; eth_label: string; start_btn: string }> = {
  en: {
    sim_title: 'Leadership Decision Simulation',
    setup_subtitle: 'Experience realistic leadership scenarios and develop critical decision-making skills in a safe, reflective environment.',
    before_you_begin_title: 'Before You Begin',
    before_you_begin_body: "This is a safe environment to practice. There's no single right answer — explore both paths to understand the full range of trade-offs.",
    lang_label: 'Language',
    eth_label: 'Character Ethnicity',
    start_btn: 'Start Simulation',
  },
  es: {
    sim_title: 'Simulación de Decisión de Liderazgo',
    setup_subtitle: 'Experimenta escenarios de liderazgo realistas y desarrolla habilidades críticas de toma de decisiones en un entorno seguro y reflexivo.',
    before_you_begin_title: 'Antes de comenzar',
    before_you_begin_body: 'Este es un entorno seguro para practicar. No hay una sola respuesta correcta — explora ambos caminos para comprender toda la gama de compensaciones.',
    lang_label: 'Idioma',
    eth_label: 'Etnia del personaje',
    start_btn: 'Iniciar simulación',
  },
};

interface Props {
  lang: Lang;
  ethnicity: Ethnicity;
  onLangChange: (l: Lang) => void;
  onEthnicityChange: (e: Ethnicity) => void;
  onStart: () => void;
}

function CustomSelect<T extends string>({ value, options, onChange, id }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; id: string }) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value);
  return (
    <div className={`csel${open ? ' open' : ''}`} id={id}>
      <div className="csel-trigger" onClick={() => setOpen(o => !o)}>
        <span className="csel-value">{current?.label}</span>
        <svg className="csel-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      {open && (
        <div className="csel-menu">
          {options.map(o => (
            <div
              key={o.value}
              className={`csel-opt${o.value === value ? ' selected' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SetupSlide({ lang, ethnicity, onLangChange, onEthnicityChange, onStart }: Props) {
  const u = SETUP_UI[lang];
  return (
    <div className="main-card slide-enter" style={{ maxWidth: 760, width: '100%', padding: 48 }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <span className="step-badge" style={{ marginBottom: 16, display: 'inline-block' }}>● Interactive Simulation</span>
        <h1 id="setup-title" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 12px', letterSpacing: '-0.5px' }}>{u.sim_title}</h1>
        <p id="setup-subtitle" style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>{u.setup_subtitle}</p>
      </div>

      <div className="callout" style={{ marginBottom: 28 }}>
        <p id="before-you-begin-title" style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 6px' }}>{u.before_you_begin_title}</p>
        <p id="before-you-begin-body" style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{u.before_you_begin_body}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
        <div>
          <label id="setup-lang-label" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{u.lang_label}</label>
          <CustomSelect<Lang>
            id="lang-select"
            value={lang}
            options={[{ value: 'en', label: 'English' }, { value: 'es', label: 'Español' }]}
            onChange={onLangChange}
          />
        </div>
        <div>
          <label id="setup-eth-label" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{u.eth_label}</label>
          <CustomSelect<Ethnicity>
            id="eth-select"
            value={ethnicity}
            options={[{ value: 'black', label: 'Black' }, { value: 'east_asian', label: 'East Asian' }]}
            onChange={onEthnicityChange}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button id="setup-start-btn" onClick={onStart} className="btn-primary" style={{ fontSize: 15, padding: '12px 32px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          {u.start_btn}
        </button>
      </div>
    </div>
  );
}
