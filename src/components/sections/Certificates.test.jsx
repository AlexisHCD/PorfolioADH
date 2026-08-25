import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { certificates } from '../../data/profile';
import Certificates from './Certificates';

it('renders both labels from certificates data', () => {
  render(<Certificates />);
  certificates.forEach((c) => {
    expect(screen.getByText(c.label)).toBeInTheDocument();
  });
});

it('renders exactly two badges', () => {
  render(<Certificates />);
  expect(screen.getAllByRole('button', { name: /ver certificado/ })).toHaveLength(2);
});

it('clicking the first badge opens the viewer', () => {
  render(<Certificates />);
  const first = screen.getAllByRole('button', { name: /ver certificado/ })[0];
  fireEvent.click(first);
  expect(
    screen.getAllByText(certificates[0].course, { exact: false }).length,
  ).toBeGreaterThan(0);
});

it('close button hides the viewer', () => {
  render(<Certificates />);
  const first = screen.getAllByRole('button', { name: /ver certificado/ })[0];
  fireEvent.click(first);
  expect(
    screen.getAllByText(certificates[0].course, { exact: false }).length,
  ).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('button', { name: 'cerrar visor' }));
  expect(
    screen.queryAllByText(certificates[0].course, { exact: false }).length,
  ).toBe(0);
});
