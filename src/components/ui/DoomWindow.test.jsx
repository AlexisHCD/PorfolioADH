import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import DoomWindow from './DoomWindow';

it('renders nothing when open is false', () => {
  render(<DoomWindow open={false} onClose={() => {}} />);
  expect(screen.queryByLabelText('cerrar doom')).toBeNull();
});

it('renders the title bar and close button when open', () => {
  render(<DoomWindow open onClose={() => {}} />);
  expect(screen.getByLabelText('cerrar doom')).toBeInTheDocument();
  expect(screen.getByText(/alex@archlinux/)).toBeInTheDocument();
});

it('clicking "Sí, salir" calls onClose', () => {
  const onClose = vi.fn();
  render(<DoomWindow open onClose={onClose} />);
  fireEvent.keyDown(window, { key: 'Escape' });
  fireEvent.click(screen.getByRole('button', { name: 'Sí, salir' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

it('clicking "Seguir jugando" hides the dialog without calling onClose', () => {
  const onClose = vi.fn();
  render(<DoomWindow open onClose={onClose} />);
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.getByText('¿Salir del juego?')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Seguir jugando' }));
  expect(screen.queryByText('¿Salir del juego?')).toBeNull();
  expect(onClose).not.toHaveBeenCalled();
});
