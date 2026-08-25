import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { identity, social } from '../../data/profile';
import About from './About';

it('renders the school name', () => {
  render(<About />);
  expect(screen.getByText(identity.school)).toBeInTheDocument();
});

it('renders github and linkedin hrefs', () => {
  render(<About />);
  expect(screen.getByRole('link', { name: /AlexisHCD/ })).toHaveAttribute('href', social.github);
  expect(screen.getByRole('link', { name: /linkedin/ })).toHaveAttribute('href', social.linkedin);
});

it('renders five interest chips', () => {
  render(<About />);
  ['Informática', 'IA', 'Tech', 'Open Source', 'Linux'].forEach((chip) => {
    expect(screen.getByText(chip)).toBeInTheDocument();
  });
});

it('renders the signature text', () => {
  render(<About />);
  expect(screen.getByText('$ whoami → dev en construcción ∎')).toBeInTheDocument();
});
