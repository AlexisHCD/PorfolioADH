import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { stack } from '../../data/profile';
import Stack from './Stack';

it('renders the SectionHead title "Stack"', () => {
  render(<Stack />);
  expect(screen.getByRole('heading', { name: /Stack/i })).toBeInTheDocument();
});

it('renders every stack group name', () => {
  render(<Stack />);
  stack.forEach((group) => {
    expect(screen.getByText(group.group)).toBeInTheDocument();
  });
});

it('renders every stack item label', () => {
  render(<Stack />);
  stack.forEach((group) => {
    group.items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
