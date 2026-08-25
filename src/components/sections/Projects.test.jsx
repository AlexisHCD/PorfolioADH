import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { projects } from '../../data/profile';
import Projects from './Projects';

it('renders all four project titles', () => {
  render(<Projects />);
  projects.forEach((p) => {
    expect(screen.getByText(p.title)).toBeInTheDocument();
  });
});

it('renders the "repo privado" badge exactly once', () => {
  render(<Projects />);
  expect(screen.getAllByText('repo privado')).toHaveLength(1);
});

it('renders the "destacado" badge exactly once', () => {
  render(<Projects />);
  expect(screen.getAllByText('destacado')).toHaveLength(1);
});

it('every card links to its repo href', () => {
  render(<Projects />);
  projects.forEach((p) => {
    expect(screen.getByRole('link', { name: new RegExp(p.title) })).toHaveAttribute(
      'href',
      p.repo,
    );
  });
});
