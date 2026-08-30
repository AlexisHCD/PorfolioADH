import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { identity, social } from '../../data/profile';
import Contact from './Contact';
import LegalPage from '../../pages/LegalPage';
import { legalDocs } from '../../data/legal';

beforeEach(() => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
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
  expect(screen.getByRole('link', { name: `${social.xUser} ↗` })).toHaveAttribute(
    'href',
    social.x,
  );
});

it('calls navigator.clipboard.writeText with the email', async () => {
  render(<Contact />);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(identity.email) }));
  await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(identity.email));
});

describe('contact form', () => {
  it('renders the form fields and the honeypot', () => {
    const { container } = render(<Contact />);
    expect(screen.getByLabelText('NOMBRE')).toBeInTheDocument();
    expect(screen.getByLabelText('CORREO')).toBeInTheDocument();
    expect(screen.getByLabelText('MENSAJE')).toBeInTheDocument();
    expect(container.querySelector('input[name="botcheck"]')).toBeInTheDocument();
  });

  it('validates client-side before sending anything', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: '$ enviar' }));
    expect(screen.getByText(/cuéntame tu nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/correo inválido/i)).toBeInTheDocument();
    expect(screen.getByText(/entre 4 y 2000 caracteres/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits to web3forms and shows the success state', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<Contact />);
    fireEvent.change(screen.getByLabelText('NOMBRE'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('CORREO'), { target: { value: 'ada@lovelace.cl' } });
    fireEvent.change(screen.getByLabelText('MENSAJE'), {
      target: { value: 'hola, vi tu portafolio' },
    });
    fireEvent.click(screen.getByRole('button', { name: '$ enviar' }));

    expect(await screen.findByText(/✓ mensaje enviado/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.web3forms.com/submit',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('shows the inline error state (no mailto) when the send fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);
    render(<Contact />);
    fireEvent.change(screen.getByLabelText('NOMBRE'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('CORREO'), { target: { value: 'ada@lovelace.cl' } });
    fireEvent.change(screen.getByLabelText('MENSAJE'), { target: { value: 'hola desde el test' } });
    fireEvent.click(screen.getByRole('button', { name: '$ enviar' }));

    expect(await screen.findByText(/✗ no se pudo enviar/i)).toBeInTheDocument();
    // graceful degradation: copy-email action instead of a mailto: jump
    expect(screen.getByRole('button', { name: /copia mi correo/i })).toBeInTheDocument();
  });
});

describe('legal pages', () => {
  it('renders the aviso legal with both law links (official titles)', () => {
    render(
      <MemoryRouter>
        <LegalPage doc="aviso" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Aviso Legal' })).toBeInTheDocument();
    for (const section of legalDocs.aviso.sections) {
      for (const link of section.links ?? []) {
        expect(screen.getByText(`${link.label} ↗`)).toHaveAttribute('href', link.href);
      }
    }
    expect(screen.getByText(/Ley N° 19\.628/)).toBeInTheDocument();
    expect(screen.getByText(/Ley N° 21\.719/)).toBeInTheDocument();
  });

  it('renders the privacy policy with the responsible contact', () => {
    render(
      <MemoryRouter>
        <LegalPage doc="privacidad" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Política de Privacidad' })).toBeInTheDocument();
    expect(screen.getAllByText(/adhcamus@gmail\.com/).length).toBeGreaterThan(0);
    expect(screen.getByText(/alexdevos-theme/)).toBeInTheDocument();
    // third-party processor links declared in the privacy doc
    expect(screen.getByText(/Web3Forms ↗/)).toHaveAttribute(
      'href',
      'https://web3forms.com/privacy-policy',
    );
  });
});
