import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import SectionHead from './SectionHead';

it('renders the num tag and title', () => {
  render(<SectionHead num="01" title="Sobre mí" />);
  expect(screen.getByText('// 01')).toBeInTheDocument();
  expect(screen.getByText('Sobre mí')).toBeInTheDocument();
});

it('title is an h2', () => {
  render(<SectionHead num="01" title="Sobre mí" />);
  expect(screen.getByRole('heading', { level: 2, name: 'Sobre mí' })).toBeInTheDocument();
});
