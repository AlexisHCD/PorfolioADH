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
      // some chips (e.g. "SQL") live in more than one group on purpose
      expect(screen.getAllByText(item).length).toBeGreaterThan(0);
    });
  });
});
