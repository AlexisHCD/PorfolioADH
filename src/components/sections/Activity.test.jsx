import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Activity from './Activity';

it('renders 182 heatmap cells', () => {
  render(<Activity />);
  expect(screen.getAllByTestId('hm-cell')).toHaveLength(182);
});

it('renders the legend ends "menos" and "más"', () => {
  render(<Activity />);
  expect(screen.getByText('menos')).toBeInTheDocument();
  expect(screen.getByText('más')).toBeInTheDocument();
});

it('shows the honest offline line when only the snapshot layer is available', () => {
  render(<Activity />);
  expect(screen.getByText(/sin conexión con github/i)).toBeInTheDocument();
  expect(screen.getByText('◌ local')).toBeInTheDocument();
});
