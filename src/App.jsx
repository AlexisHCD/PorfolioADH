import { useCallback, useState } from 'react';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import AmbientField from './components/layout/AmbientField';
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
import { useKonami } from './hooks/useKonami';
import { playSurgeChime } from './lib/sound';

/** Root shell: theme provider (hook), ambient background, nav + sections. */
export default function App() {
  const { theme, toggle } = useTheme();
  const [doomOpen, setDoomOpen] = useState(false);
  const [surgeActive, setSurgeActive] = useState(false);

  // Konami code -> phosphor overdrive surge
  useKonami({
    onUnlock: useCallback(() => {
      if (doomOpen) return;
      setSurgeActive(true);
      playSurgeChime();
    }, [doomOpen]),
  });
  const onSurgeDone = useCallback(() => setSurgeActive(false), []);
  return (
    <div className="relative min-h-screen">
      <ScrollProgress />
      <AmbientField />
      <Nav theme={theme} onToggle={toggle} />
      <main className="relative z-[1]">
        <Hero onLaunchDoom={() => setDoomOpen(true)} />
        <About />
        <Stack />
        <Activity />
        <Projects />
        <Roadmap />
        <Certificates />
        <Contact />
      </main>
      <Footer />
      <OverdriveSurge active={surgeActive} onDone={onSurgeDone} />
      <DoomWindow open={doomOpen} onClose={() => setDoomOpen(false)} />
    </div>
  );
}
