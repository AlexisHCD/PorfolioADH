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

it('clicking the first badge opens the viewer and types the ledger', async () => {
  render(<Certificates />);
  const first = screen.getAllByRole('button', { name: /ver certificado/ })[0];
  fireEvent.click(first);
  // the ledger types character by character — wait for the course line
  const matches = await screen.findAllByText(certificates[0].course, { exact: false }, {
    timeout: 6000,
  });
  expect(matches.length).toBeGreaterThan(0);
});

it('close button hides the viewer', () => {
  render(<Certificates />);
  const first = screen.getAllByRole('button', { name: /ver certificado/ })[0];
  fireEvent.click(first);
  // viewer-only marker: the arch dialog with its accessible name
  expect(screen.getByRole('dialog', { name: 'visor de certificados' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'cerrar visor' }));
  expect(screen.queryByRole('dialog', { name: 'visor de certificados' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'cerrar visor' })).not.toBeInTheDocument();
});
