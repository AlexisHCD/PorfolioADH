import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import ThemeToggle from './ThemeToggle';

it('shows the destination mode (día) while in dark theme', () => {
  render(<ThemeToggle theme="dark" onToggle={() => {}} />);
  expect(screen.getByText('día')).toBeInTheDocument();
  expect(screen.queryByText('noche')).not.toBeInTheDocument();
});

it('fires the toggle handler on click', () => {
  let clicks = 0;
  render(<ThemeToggle theme="light" onToggle={() => clicks++} />);
  fireEvent.click(screen.getByRole('button'));
  expect(clicks).toBe(1);
});
