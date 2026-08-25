import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { certificates } from '../../data/profile';
import CertificateBadge from './CertificateBadge';

const noop = () => {};

it('renders a button with aria-label containing the course name', () => {
  render(<CertificateBadge cert={certificates[0]} onSelect={noop} />);
  expect(
    screen.getByRole('button', { name: `ver certificado ${certificates[0].course}` }),
  ).toBeInTheDocument();
});

it('renders sealText content in the svg text', () => {
  render(<CertificateBadge cert={certificates[0]} onSelect={noop} />);
  expect(screen.getByText(certificates[0].sealText)).toBeInTheDocument();
});

it('renders the issuer org text', () => {
  render(<CertificateBadge cert={certificates[1]} onSelect={noop} />);
  expect(screen.getByText(certificates[1].issuer)).toBeInTheDocument();
});
