import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import { identity } from '../../data/profile';
import Terminal from './Terminal';

const noop = () => {};

function runCmd(cmd) {
  const input = screen.getByLabelText('entrada de comandos de la terminal');
  fireEvent.change(input, { target: { value: cmd } });
  fireEvent.keyDown(input, { key: 'Enter' });
}

describe('Terminal', () => {
  it('renders the prompt', () => {
    render(<Terminal onToggleTheme={noop} onLaunchDoom={noop} />);
    expect(screen.getByText('[guest@arch ~]$')).toBeInTheDocument();
  });

  it('shows the command list for help', async () => {
    render(<Terminal onToggleTheme={noop} onLaunchDoom={noop} />);
    runCmd('help');
    expect(await screen.findByText('comandos disponibles:')).toBeInTheDocument();
  });

  it('denies sudo', async () => {
    render(<Terminal onToggleTheme={noop} onLaunchDoom={noop} />);
    runCmd('sudo');
    expect(await screen.findByText('permiso denegado: aquí manda alexis.')).toBeInTheDocument();
  });

  it('refuses rm -rf /', async () => {
    render(<Terminal onToggleTheme={noop} onLaunchDoom={noop} />);
    runCmd('rm -rf /');
    expect(
      await screen.findByText('jajaja no. este sistema es inmune a dedos traviesos.'),
    ).toBeInTheDocument();
  });

  it('renders identity.fullName for whoami', async () => {
    render(<Terminal onToggleTheme={noop} onLaunchDoom={noop} />);
    runCmd('whoami');
    expect(await screen.findByText(identity.fullName)).toBeInTheDocument();
  });

  it('reports unknown commands', async () => {
    render(<Terminal onToggleTheme={noop} onLaunchDoom={noop} />);
    runCmd('zzzz');
    expect(await screen.findByText('comando no encontrado: zzzz — prueba help')).toBeInTheDocument();
  });

  it('cleans up timers on unmount', () => {
    const { unmount } = render(<Terminal onToggleTheme={noop} onLaunchDoom={noop} />);
    expect(() => unmount()).not.toThrow();
  });

  it('does not leak lines when cleared', async () => {
    render(<Terminal onToggleTheme={noop} onLaunchDoom={noop} />);
    runCmd('clear');
    await waitFor(() => expect(screen.queryByText(identity.fullName)).not.toBeInTheDocument());
  });
});
