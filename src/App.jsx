import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import AmbientField from './components/layout/AmbientField';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Stack from './components/sections/Stack';
import Activity from './components/sections/Activity';
import { useTheme } from './hooks/useTheme';

/** Root shell: theme provider (hook), ambient background, nav + sections. */
export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <div className="relative min-h-screen">
      <AmbientField />
      <Nav theme={theme} onToggle={toggle} />
      <main className="relative z-[1]">
        <Hero />
        <About />
        <Stack />
        <Activity />
        {/* Phase 3 remaining: Projects, Roadmap, Certificates — Contact mounts last */}
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
