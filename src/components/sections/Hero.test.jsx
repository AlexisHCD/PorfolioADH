import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Hero from './Hero';

it('renders the kinetic name from profile data', () => {
  render(<Hero />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/alexis/i);
});

it('renders the three CTAs with icons', () => {
  render(<Hero />);
  const links = screen.getAllByRole('link');
  const hrefs = links.map((l) => l.getAttribute('href'));
  expect(hrefs).toContain('https://github.com/AlexisHCD');
  expect(hrefs).toContain('https://www.linkedin.com/in/alexis-hern%C3%A1ndez-2b3017367');
  expect(hrefs).toContain('#proyectos');
});
