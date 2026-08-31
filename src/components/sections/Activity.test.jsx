import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Activity from './Activity';
import { githubSnapshot } from '../../data/githubSnapshot';

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

it('renders the github-style calendar when the payload carries one', () => {
  const calendar = [];
  const start = new Date('2026-01-01T00:00:00Z');
  const end = new Date(); // today
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    calendar.push({ date: new Date(t).toISOString().slice(0, 10), count: t % 7 === 0 ? 3 : 0 });
  }
  localStorage.setItem(
    'alexdevos-github-cache:2026',
    JSON.stringify({
      savedAt: Date.now(),
      data: { ...githubSnapshot, calendar, calendarYear: 2026, calendarTotal: 42 },
    }),
  );
  render(<Activity />);
  expect(screen.getByText(/42 contribuciones · 2026/)).toBeInTheDocument();
  // year selector shows both available years
  expect(screen.getByRole('button', { name: '2026' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2025' })).toBeInTheDocument();
});
