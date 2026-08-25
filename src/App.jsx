import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import AmbientField from './components/layout/AmbientField';
import Hero from './components/sections/Hero';
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
        {/* Phase 3 sections mount here: About, Stack, Activity, Projects,
            Roadmap, Certificates, Contact */}
        <section id="sobre-mi" className="mx-auto max-w-5xl px-6 py-24">
          <p className="font-mono text-xs tracking-[0.2em] text-accent">{'// 01'}</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase">Sobre mí</h2>
        </section>
      </main>
      <Footer />
    </div>
  );
}
