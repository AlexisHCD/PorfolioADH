import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import { BgField } from './components/layout/BgField';
import { GrainScanlines } from './components/layout/GrainScanlines';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';
import { useTheme } from './hooks/useTheme';
import DoomWindow from './components/ui/DoomWindow';
import ScrollProgress from './components/ui/ScrollProgress';
import OverdriveSurge from './components/ui/OverdriveSurge';
import { Loader } from './components/ui/Loader';
import { useKonami } from './hooks/useKonami';
import { useLenis, lenisStore } from './hooks/useLenis';
import { playSurgeChime } from './lib/sound';

/**
 * Scroll controller: to the section anchor when the route carries one,
 * otherwise to the top on route change. Scrolls go through Lenis when it is
 * alive — native scrollIntoView gets overridden by Lenis's raf loop.
 */
function RouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const t = setTimeout(() => {
          const lenis = lenisStore.current;
          // hidden tab: rAF (Lenis's engine) is frozen — jump instantly
          if (lenis?.scrollTo) {
            lenis.scrollTo(el, { offset: -70, duration: 1.2, immediate: document.hidden });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
        return () => clearTimeout(t);
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** Root shell: router, theme provider (hook), ambient background, nav + routes. */
export default function App() {
  const { theme, toggle } = useTheme();
  const [doomOpen, setDoomOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [surgeActive, setSurgeActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Smooth scroll (Lenis wired into GSAP ticker).
  useLenis();

  // Konami code -> phosphor overdrive surge (disabled while DOOM / cert viewer open).
  useKonami({
    onUnlock: useCallback(() => {
      if (doomOpen || certOpen) return;
      setSurgeActive(true);
      playSurgeChime();
    }, [doomOpen, certOpen]),
  });
  const onSurgeDone = useCallback(() => setSurgeActive(false), []);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        {/* a11y: keyboard users jump straight past the nav */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10050] focus:rounded-lg focus:bg-[var(--accent-btn)] focus:px-4 focus:py-2.5 focus:font-mono focus:text-sm focus:text-accent-contrast"
        >
          saltar al contenido
        </a>
        {!loaded && <Loader onDone={() => setLoaded(true)} />}
        <GrainScanlines />
        <BgField />
        <ScrollProgress />
        <Nav theme={theme} onToggle={toggle} />
        <RouteScroll />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onLaunchDoom={() => setDoomOpen(true)}
                onViewerOpenChange={setCertOpen}
                onToggleTheme={toggle}
              />
            }
          />
          <Route path="/aviso-legal" element={<LegalPage doc="aviso" />} />
          <Route path="/politica-de-privacidad" element={<LegalPage doc="privacidad" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        <OverdriveSurge active={surgeActive} onDone={onSurgeDone} />
        <DoomWindow open={doomOpen} onClose={() => setDoomOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
