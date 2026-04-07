import type { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './index.module.css';

// ─── GSAP (dynamic import for SSR safety) ────────────────────────────────────

// ─── Content data ─────────────────────────────────────────────────────────────

const FEATURES = {
  en: [
    { icon: '🔐', title: 'AES-GCM Encryption', tag: 'SECURITY', description: 'Military-grade AES-128, 192 or 256-bit encryption via the Web Crypto API. Values encrypt on write, decrypt on read — transparently.' },
    { icon: '⏱', title: 'TTL Expiration', tag: 'LIFECYCLE', description: 'Configure item lifetimes in seconds, minutes, hours or days. Expired items are purged automatically on the next read.' },
    { icon: '🔒', title: 'Type-Safe API', tag: 'TYPESCRIPT', description: 'Use createTypedStorage<Schema>() to enforce compile-time type checking on keys and values. Catch errors before they happen.' },
    { icon: '📡', title: 'Cross-Tab Sync', tag: 'REALTIME', description: 'React to storage mutations from other browser tabs via onChange. Build reactive multi-tab apps with zero boilerplate.' },
    { icon: '🏷', title: 'Namespacing', tag: 'ISOLATION', description: 'Prefix-based isolation keeps storage instances completely independent. clear() and size() only affect their own domain.' },
    { icon: '🧩', title: 'Batch Operations', tag: 'PERFORMANCE', description: 'Read and write multiple keys in a single call with setItems, getItems and getAll. Parallel execution under the hood.' },
  ],
  es: [
    { icon: '🔐', title: 'Encriptación AES-GCM', tag: 'SEGURIDAD', description: 'Encriptación AES-128, 192 o 256-bit via la Web Crypto API. Los valores se encriptan en escritura y se descifran en lectura automáticamente.' },
    { icon: '⏱', title: 'Expiración TTL', tag: 'CICLO DE VIDA', description: 'Configura el tiempo de vida en segundos, minutos, horas o días. Los items expirados se eliminan en la siguiente lectura.' },
    { icon: '🔒', title: 'API con Tipos', tag: 'TYPESCRIPT', description: 'Usa createTypedStorage<Schema>() para verificación de tipos en compilación. Detecta errores antes de que ocurran en runtime.' },
    { icon: '📡', title: 'Sync Cross-Tab', tag: 'TIEMPO REAL', description: 'Reacciona a cambios desde otras pestañas con onChange. Experiencias multi-tab reactivas sin ningún boilerplate.' },
    { icon: '🏷', title: 'Namespacing', tag: 'AISLAMIENTO', description: 'Aislamiento por prefijo. clear() y size() solo afectan su propio namespace — sin colisiones entre instancias.' },
    { icon: '🧩', title: 'Operaciones Batch', tag: 'RENDIMIENTO', description: 'Lee y escribe múltiples claves con setItems, getItems y getAll. Ejecución paralela eficiente internamente.' },
  ],
};

const EXAMPLES = {
  en: [
    {
      label: 'Basic', file: 'storage.ts',
      code: `import { ValiStorages } from 'vali-storages';

const storage = new ValiStorages();

// Write & read
await storage.setItem('username', 'felipe');
const name = await storage.getItem<string>('username');
// → 'felipe'

// Check, count, batch read
storage.has('username');           // → true
storage.size();                    // → 1
const all = await storage.getAll();// → { username: 'felipe' }

// Cache pattern — compute only if missing
const data = await storage.getOrSet('config', async () => {
  return await fetchConfigFromAPI();
});

// Remove & clean up
storage.removeItem('username');
storage.removeExpired();
storage.clear();`,
    },
    {
      label: 'Encryption', file: 'secure.ts',
      code: `import { ValiStorages, AES, TimeUnit } from 'vali-storages';

const vault = new ValiStorages({
  isEncrypt: true,
  predefinedKey: 'my-secret-passphrase',
  keySize: AES.AES_256,       // 256-bit key
  timeExpiration: 8,
  timeUnit: TimeUnit.HOURS,   // expires in 8h
  slidingExpiration: true,    // reset TTL on read
  prefix: 'auth',
});

// Stored as AES-256 ciphertext in localStorage
await vault.setItem('token', 'eyJhbGciOiJSUzI1NiJ9...');

// Decrypted automatically on read
const token = await vault.getItem<string>('token');
// → 'eyJhbGciOiJSUzI1NiJ9...'`,
    },
    {
      label: 'Type-Safe', file: 'typed.ts',
      code: `import { createTypedStorage } from 'vali-storages';

interface AppSchema {
  userId: number;
  token: string;
  settings: {
    theme: 'dark' | 'light';
    language: 'en' | 'es';
  };
}

const storage = createTypedStorage<AppSchema>({
  prefix: 'myapp',
  isEncrypt: true,
  predefinedKey: 'secret',
});

await storage.setItem('userId', 42);          // OK
await storage.setItem('userId', 'wrong');     // Type error
await storage.setItem('unknown', 'value');    // Key error

const id = await storage.getItem('userId');   // number | null
const cfg = await storage.getItem('settings');// { theme, language } | null`,
    },
    {
      label: 'Cross-Tab', file: 'sync.ts',
      code: `import { ValiStorages } from 'vali-storages';

// Fires when ANOTHER tab modifies storage
const storage = new ValiStorages({
  prefix: 'app',
  onChange: (key, newValue) => {
    if (key === 'theme') applyTheme(newValue as string);
    if (key === 'user' && newValue === null) {
      // User logged out in another tab
      redirectToLogin();
    }
  },
});

// Batch write — parallel execution
await storage.setItems({
  theme: 'dark',
  language: 'en',
  lastSeen: Date.now(),
});

// Clean up on component unmount
storage.destroy();`,
    },
  ],
  es: [
    {
      label: 'Básico', file: 'storage.ts',
      code: `import { ValiStorages } from 'vali-storages';

const storage = new ValiStorages();

// Escribir y leer
await storage.setItem('usuario', 'felipe');
const nombre = await storage.getItem<string>('usuario');
// → 'felipe'

// Verificar, contar, leer todo
storage.has('usuario');              // → true
storage.size();                      // → 1
const todo = await storage.getAll(); // → { usuario: 'felipe' }

// Patrón cache — calcula solo si no existe
const data = await storage.getOrSet('config', async () => {
  return await obtenerConfigDeAPI();
});

// Eliminar y limpiar
storage.removeItem('usuario');
storage.removeExpired();
storage.clear();`,
    },
    {
      label: 'Encriptación', file: 'secure.ts',
      code: `import { ValiStorages, AES, TimeUnit } from 'vali-storages';

const vault = new ValiStorages({
  isEncrypt: true,
  predefinedKey: 'mi-frase-secreta',
  keySize: AES.AES_256,
  timeExpiration: 8,
  timeUnit: TimeUnit.HOURS,
  slidingExpiration: true,
  prefix: 'auth',
});

// Se guarda como texto cifrado AES-256 en localStorage
await vault.setItem('token', 'eyJhbGciOiJSUzI1NiJ9...');

// Se descifra automáticamente al leer
const token = await vault.getItem<string>('token');
// → 'eyJhbGciOiJSUzI1NiJ9...'`,
    },
    {
      label: 'Tipado', file: 'typed.ts',
      code: `import { createTypedStorage } from 'vali-storages';

interface AppSchema {
  userId: number;
  token: string;
  configuracion: {
    tema: 'oscuro' | 'claro';
    idioma: 'en' | 'es';
  };
}

const storage = createTypedStorage<AppSchema>({
  prefix: 'miapp',
  isEncrypt: true,
  predefinedKey: 'secreto',
});

await storage.setItem('userId', 42);           // OK
await storage.setItem('userId', 'error');      // Error de tipo
await storage.setItem('desconocido', 'valor'); // Clave inválida

const id = await storage.getItem('userId');    // number | null`,
    },
    {
      label: 'Cross-Tab', file: 'sync.ts',
      code: `import { ValiStorages } from 'vali-storages';

// Este callback se ejecuta cuando OTRA pestaña modifica el storage
const storage = new ValiStorages({
  prefix: 'app',
  onChange: (clave, nuevoValor) => {
    if (clave === 'tema') aplicarTema(nuevoValor as string);
    if (clave === 'usuario' && nuevoValor === null) {
      // El usuario cerró sesión en otra pestaña
      redirigirAlLogin();
    }
  },
});

// Escritura batch — ejecución paralela
await storage.setItems({
  tema: 'oscuro',
  idioma: 'es',
  ultimaVez: Date.now(),
});

storage.destroy();`,
    },
  ],
};

// ─── Token-based syntax highlighter (single-pass, no innerHTML) ──────────────

type Token = { type: 'kw' | 'str' | 'num' | 'comment' | 'plain'; text: string };

// Groups: 1=comment  2=string  3=keyword  4=number
const SYNTAX_PATTERN =
  /(\/\/[^\n]*)|((?:'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`|"[^"\\]*(?:\\.[^"\\]*)*"))|\b(import|export|from|const|let|var|await|async|interface|type|new|if|return|true|false|null|undefined|default)\b|\b(\d+)\b/g;

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(SYNTAX_PATTERN)) {
    if (m.index > last) tokens.push({ type: 'plain', text: code.slice(last, m.index) });
    if      (m[1]) tokens.push({ type: 'comment', text: m[1] });
    else if (m[2]) tokens.push({ type: 'str',     text: m[2] });
    else if (m[3]) tokens.push({ type: 'kw',      text: m[3] });
    else if (m[4]) tokens.push({ type: 'num',     text: m[4] });
    last = m.index + m[0].length;
  }
  if (last < code.length) tokens.push({ type: 'plain', text: code.slice(last) });
  return tokens;
}

const TOKEN_CLASS: Record<Token['type'], string> = {
  kw: 'tok-kw',
  str: 'tok-str',
  num: 'tok-num',
  comment: 'tok-comment',
  plain: '',
};

function CodeHighlight({ code }: { code: string }): ReactNode {
  const tokens = tokenize(code);
  return (
    <>
      {tokens.map((tok, i) =>
        tok.type === 'plain' ? (
          <span key={i}>{tok.text}</span>
        ) : (
          <span key={i} className={styles[TOKEN_CLASS[tok.type]]}>{tok.text}</span>
        )
      )}
    </>
  );
}

// ─── Text scramble hook ───────────────────────────────────────────────────────

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=';

function useScrambleText(finalText: string, trigger: boolean): string {
  const [output, setOutput] = useState('');
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    let iter = 0;
    cancelAnimationFrame(frameRef.current);
    const totalFrames = finalText.length * 2.5;

    function tick() {
      iter++;
      const resolved = Math.floor((iter / totalFrames) * finalText.length);
      let result = '';
      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === ' ' || finalText[i] === '-') { result += finalText[i]; continue; }
        result += i < resolved ? finalText[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setOutput(result);
      if (iter < totalFrames + 5) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setOutput(finalText);
      }
    }
    tick();
    return () => cancelAnimationFrame(frameRef.current);
  }, [finalText, trigger]);

  return output;
}

// ─── Copy hook ────────────────────────────────────────────────────────────────

function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  return [
    copied,
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    },
  ];
}

// ─── Feature card (3-D tilt) ──────────────────────────────────────────────────

interface Feature {
  icon: string; title: string; tag: string; description: string;
}

function FeatureCard({ icon, title, tag, description }: Feature) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 16;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -16;
    el.style.setProperty('--rx', `${y}deg`);
    el.style.setProperty('--ry', `${x}deg`);
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  return (
    <div ref={ref} className={styles.featureCard} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className={styles.featureGlow} />
      <span className={styles.featureTag}>{tag}</span>
      <div className={styles.featureIconWrap}>
        <span className={styles.featureIcon}>{icon}</span>
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{description}</p>
    </div>
  );
}

// ─── Code tabs ────────────────────────────────────────────────────────────────

interface ExTab { label: string; file: string; code: string; }

function CodeTabs({ tabs }: { tabs: ExTab[] }) {
  const [active, setActive] = useState(0);
  const [copied, copy] = useCopy();
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const btn = tabRefs.current[active];
    const ind = indicatorRef.current;
    if (!btn || !ind) return;
    ind.style.left = `${btn.offsetLeft}px`;
    ind.style.width = `${btn.offsetWidth}px`;
  }, [active]);

  return (
    <div className={styles.codeTabs}>
      <div className={styles.codeTopBar}>
        <div className={styles.macDots}>
          <span style={{ background: '#FF5F57' }} />
          <span style={{ background: '#FFBD2E' }} />
          <span style={{ background: '#28CA41' }} />
        </div>
        <div className={styles.codeTabList} role="tablist">
          <span ref={indicatorRef} className={styles.tabIndicator} aria-hidden />
          {tabs.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              aria-selected={active === i}
              className={`${styles.codeTab} ${active === i ? styles.codeTabActive : ''}`}
              onClick={() => setActive(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.codeRight}>
          <span className={styles.codeFilename}>{tabs[active].file}</span>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copyDone : ''}`}
            onClick={() => copy(tabs[active].code)}
            aria-label="Copy code"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      {/* key={active} re-mounts the pre on every tab change, triggering the CSS animation */}
      <pre key={active} className={styles.codePre}>
        <code><CodeHighlight code={tabs[active].code} /></code>
      </pre>
    </div>
  );
}

// ─── Animated grid background ─────────────────────────────────────────────────

function GridBg() {
  return (
    <div className={styles.gridBg} aria-hidden>
      <div className={styles.gridLines} />
      <div className={styles.glow1} />
      <div className={styles.glow2} />
      <div className={styles.glow3} />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const isEs = i18n.currentLocale === 'es';
  const lang = isEs ? 'es' : 'en';

  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const featuresHeadRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  const [scrambleReady, setScrambleReady] = useState(false);
  const [copiedBun, copyBun] = useCopy();
  const [copiedNpm, copyNpm] = useCopy();
  const scrambled = useScrambleText('Vali-Storages', scrambleReady);

  useEffect(() => {
    (async () => {
      const g = await import('gsap');
      const st = await import('gsap/ScrollTrigger');
      g.gsap.registerPlugin(st.ScrollTrigger);

      // ── Hero entrance timeline ──
      const tl = g.gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.set([badgeRef.current, logoRef.current, titleRef.current, taglineRef.current, ctaRef.current], { opacity: 0 });
      tl.to(badgeRef.current,  { opacity: 1, y: 0, duration: 0.5 }, 0.15)
        .to(logoRef.current,   { opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.5)' }, 0.3)
        .add(() => setScrambleReady(true), 0.45)
        .to(titleRef.current,  { opacity: 1, y: 0, duration: 0.6 }, 0.55)
        .to(taglineRef.current,{ opacity: 1, y: 0, duration: 0.55 }, 0.7)
        .to(ctaRef.current,    { opacity: 1, y: 0, duration: 0.55 }, 0.85);

      // ── Features scroll trigger ──
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('[data-card]');
        g.gsap.fromTo(cards,
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: featuresRef.current, start: 'top 78%' } }
        );
        if (featuresHeadRef.current) {
          g.gsap.fromTo(featuresHeadRef.current,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.5,
              scrollTrigger: { trigger: featuresRef.current, start: 'top 85%' } }
          );
        }
      }

      // ── Stats scroll trigger ──
      if (statsRef.current) {
        g.gsap.fromTo(
          statsRef.current.querySelectorAll('[data-stat]'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.1,
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } }
        );
      }
    })();
  }, []);

  const heroTagline = isEs ? '// almacenamiento, encriptado y tipado.' : '// browser storage, encrypted and typed.';

  return (
    <Layout description={heroTagline}>
      <Head>
        <title>Vali-Storages — browser storage, encrypted and typed</title>
        <meta name="description" content="TypeScript library for browser storage with AES-GCM encryption, TTL, namespacing, cross-tab sync and typed API." />
      </Head>

      {/* ─── HERO ─────────────────────────────────────── */}
      <section ref={heroRef} className={styles.hero}>
        <GridBg />
        <div className={styles.heroContent}>

          <div ref={badgeRef} className={styles.heroBadge} style={{ opacity: 0, transform: 'translateY(-12px)' }}>
            <span className={styles.badgePulse} />
            npm · v2.0.0
          </div>

          <div ref={logoRef} className={styles.heroLogoWrap} style={{ opacity: 0, transform: 'scale(0.8)' }}>
            <div className={styles.logoRing} />
            <img src="/img/logo-dark.png" alt="Vali-Storages" width={72} height={72} className={styles.heroLogo} />
          </div>

          <h1 ref={titleRef} className={styles.heroTitle} style={{ opacity: 0, transform: 'translateY(16px)' }}>
            {scrambled || 'Vali-Storages'}
          </h1>

          <p ref={taglineRef} className={styles.heroTagline} style={{ opacity: 0, transform: 'translateY(12px)' }}>
            <span className={styles.tagSlash}>//</span>
            {' '}{isEs ? 'almacenamiento,' : 'browser storage,'}
            {' '}<span className={styles.tagBlue}>{isEs ? 'encriptado' : 'encrypted'}</span>
            {' & '}<span className={styles.tagTeal}>{isEs ? 'tipado' : 'typed'}</span>.
          </p>

          <div ref={ctaRef} className={styles.heroCtas} style={{ opacity: 0, transform: 'translateY(12px)' }}>
            <Link className={styles.btnPrimary} to="/docs/intro">
              {isEs ? 'Comenzar →' : 'Get Started →'}
            </Link>
            <a className={styles.btnGhost} href="https://github.com/UBF21/vali-storages" target="_blank" rel="noopener noreferrer">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <a className={styles.btnGhost} href="https://www.npmjs.com/package/vali-storages" target="_blank" rel="noopener noreferrer">
              npm
            </a>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden>
          <span className={styles.scrollLine} />
          <span className={styles.scrollText}>scroll</span>
        </div>
      </section>

      {/* ─── INSTALL ──────────────────────────────────── */}
      <section className={styles.installStrip}>
        <div className={styles.installInner}>
          <span className={styles.installLabel}>{isEs ? '— Instalación' : '— Install'}</span>
          <div className={styles.installCmds}>
            <div className={styles.installCmd}>
              <span className={styles.prompt}>$</span>
              <code>bun add vali-storages</code>
              <button
                className={`${styles.installCopy} ${copiedBun ? styles.copiedDone : ''}`}
                onClick={() => copyBun('bun add vali-storages')}
                aria-label="Copy bun command"
              >
                {copiedBun ? '✓' : '⧉'}
              </button>
            </div>
            <span className={styles.installOr}>or</span>
            <div className={styles.installCmd}>
              <span className={styles.prompt}>$</span>
              <code>npm install vali-storages</code>
              <button
                className={`${styles.installCopy} ${copiedNpm ? styles.copiedDone : ''}`}
                onClick={() => copyNpm('npm install vali-storages')}
                aria-label="Copy npm command"
              >
                {copiedNpm ? '✓' : '⧉'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────── */}
      <section ref={statsRef} className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {[
            { v: 'AES-256', l: isEs ? 'Nivel de cifrado' : 'Encryption level' },
            { v: '3',       l: isEs ? 'Tamaños de clave' : 'Key sizes' },
            { v: '4',       l: isEs ? 'Unidades de tiempo' : 'Time units' },
            { v: '100%',    l: isEs ? 'Tipado TypeScript' : 'TypeScript typed' },
            { v: '0',       l: isEs ? 'Dependencias' : 'Dependencies' },
          ].map((s) => (
            <div key={s.l} data-stat className={styles.statItem} style={{ opacity: 0 }}>
              <span className={styles.statValue}>{s.v}</span>
              <span className={styles.statLabel}>{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section ref={featuresRef} className={styles.featuresSection}>
        <div ref={featuresHeadRef} className={styles.sectionHead} style={{ opacity: 0 }}>
          <span className={styles.eyebrow}>{isEs ? '— Características' : '— Features'}</span>
          <h2 className={styles.sectionTitle}>{isEs ? 'Todo lo que necesitas' : 'Everything you need'}</h2>
          <p className={styles.sectionSub}>
            {isEs
              ? 'Una API async, limpia y completamente tipada sobre localStorage y sessionStorage.'
              : 'A clean, fully typed async API on top of localStorage and sessionStorage.'}
          </p>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES[lang].map((f) => (
            <div key={f.title} data-card style={{ opacity: 0 }}>
              <FeatureCard {...f} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── EXAMPLES ─────────────────────────────────── */}
      <section className={styles.examplesSection}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>{isEs ? '— Ejemplos' : '— Examples'}</span>
          <h2 className={styles.sectionTitle}>{isEs ? 'Ve el código' : 'See it in action'}</h2>
          <p className={styles.sectionSub}>
            {isEs
              ? 'Desde uso básico hasta encriptación AES-256, tipado estricto y sync entre pestañas.'
              : 'From basic usage to AES-256 encryption, strict typing and cross-tab sync.'}
          </p>
        </div>
        <CodeTabs tabs={EXAMPLES[lang]} />
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaRing} aria-hidden />
          <h2 className={styles.ctaTitle}>{isEs ? 'Listo para empezar?' : 'Ready to start?'}</h2>
          <p className={styles.ctaText}>
            {isEs
              ? 'Explora la documentación completa y lleva tu manejo de storage al siguiente nivel.'
              : 'Explore the full docs and take your storage management to the next level.'}
          </p>
          <div className={styles.ctaBtns}>
            <Link className={styles.btnPrimary} to="/docs/intro">
              {isEs ? 'Ver documentación →' : 'Read the docs →'}
            </Link>
            <a className={styles.btnGhost} href="https://github.com/UBF21/vali-storages" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
