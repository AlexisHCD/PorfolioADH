import { useCallback, useState } from 'react';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import { BgField } from './components/layout/BgField';
import { GrainScanlines } from './components/layout/GrainScanlines';
import { Marquee } from './components/ui/Marquee';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Stack from './components/sections/Stack';
import Activity from './components/sections/Activity';
import Projects from './components/sections/Projects';
import Roadmap from './components/sections/Roadmap';
import Certificates from './components/sections/Certificates';
import { useTheme } from './hooks/useTheme';
import DoomWindow from './components/ui/DoomWindow';
import ScrollProgress from './components/ui/ScrollProgress';
import OverdriveSurge from './components/ui/OverdriveSurge';
import { Loader } from './components/ui/Loader';
import { useKonami } from './hooks/useKonami';
import { useLenis } from './hooks/useLenis';
import { playSurgeChime } from './lib/sound';

/** Root shell: theme provider (hook), ambient background, nav + sections. */
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
    <div className="relative min-h-screen">
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <GrainScanlines />
      <BgField />
      <ScrollProgress />
      <Nav theme={theme} onToggle={toggle} />
      <main className="relative z-[1]">
        <Hero onLaunchDoom={() => setDoomOpen(true)} />
        <Marquee />
        <About />
        <Stack />
        <Activity />
        <Projects />
        <Roadmap />
        <Certificates onViewerOpenChange={setCertOpen} />
        <Contact />
      </main>
      <Footer />
      <OverdriveSurge active={surgeActive} onDone={onSurgeDone} />
      <DoomWindow open={doomOpen} onClose={() => setDoomOpen(false)} />
    </div>
  );
}
