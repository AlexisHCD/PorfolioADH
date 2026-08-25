import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi, beforeEach } from 'vitest';
import { identity, social } from '../../data/profile';
import Contact from './Contact';

beforeEach(() => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
});

it('shows the email in the button', () => {
  render(<Contact />);
  // the label also carries the copy glyph, so match loosely
  expect(screen.getByText(new RegExp(identity.email.replace('.', '\\.')))).toBeInTheDocument();
});

it('switches label to copied state on click', async () => {
  render(<Contact />);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(identity.email) }));
  expect(await screen.findByText('copiado al portapapeles ✓')).toBeInTheDocument();
});

it('x link has the social.x href', () => {
  render(<Contact />);
  expect(screen.getByRole('link', { name: 'x ↗' })).toHaveAttribute('href', social.x);
});

it('calls navigator.clipboard.writeText with the email', async () => {
  render(<Contact />);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(identity.email) }));
  await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(identity.email));
});
