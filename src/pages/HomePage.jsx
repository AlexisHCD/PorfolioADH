import { useState } from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Contact from '../components/sections/Contact';
import Stack from '../components/sections/Stack';
import Activity from '../components/sections/Activity';
import Projects from '../components/sections/Projects';
import Roadmap from '../components/sections/Roadmap';
import Certificates from '../components/sections/Certificates';
import StackWindow from '../components/ui/StackWindow';
import { Marquee } from '../components/ui/Marquee';

/** Home route — the one-page portfolio section flow. */
export default function HomePage({ onLaunchDoom, onViewerOpenChange, onToggleTheme }) {
  const [stackOpen, setStackOpen] = useState(false);

  return (
    <main id="contenido" className="relative z-[1]">
      <Hero onLaunchDoom={onLaunchDoom} onOpenStack={() => setStackOpen(true)} onToggleTheme={onToggleTheme} />
      <Marquee />
      <About />
      <Stack />
      <Activity />
      <Projects />
      <Roadmap />
      <Certificates onViewerOpenChange={onViewerOpenChange} />
      <Contact />
      <StackWindow open={stackOpen} onClose={() => setStackOpen(false)} />
    </main>
  );
}
