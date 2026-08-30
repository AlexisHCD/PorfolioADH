import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { projects } from '../../data/profile';
import Projects from './Projects';

it('renders all five project titles', () => {
  render(<Projects />);
  projects.forEach((p) => {
    expect(screen.getByText(p.title)).toBeInTheDocument();
  });
});

it('renders the index tag line for every card', () => {
  render(<Projects />);
  projects.forEach((p) => {
    expect(screen.getByText(`// ${p.num} — ${p.tag}`)).toBeInTheDocument();
  });
});

it('every card links to its repo href', () => {
  render(<Projects />);
  projects.forEach((p) => {
    const link = screen.getByRole('link', { name: new RegExp(p.title) });
    expect(link).toHaveAttribute('href', p.repo);
    if (p.repo.startsWith('#')) {
      expect(link).not.toHaveAttribute('target');
    } else {
      expect(link).toHaveAttribute('target', '_blank');
    }
  });
});
