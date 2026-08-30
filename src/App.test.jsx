import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App shell', () => {
  it('renders nav, hero and footer', () => {
    render(<App />);
    expect(screen.getByText('Sobre mí')).toBeInTheDocument();
    expect(screen.getByText(/ALEXIS HERNÁNDEZ CAMUS — SAN ANTONIO, CL/i)).toBeInTheDocument();
  });

  it('exposes the day/night switcher', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /cambiar a modo día/i })).toBeInTheDocument();
  });
});
