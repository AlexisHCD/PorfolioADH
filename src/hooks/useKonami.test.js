import { renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useKonami } from './useKonami';

/** Fire a synthetic window keydown. */
function press(key) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

it('fires onUnlock after the full Konami sequence', () => {
  const onUnlock = vi.fn();
  renderHook(() => useKonami({ onUnlock }));
  ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'].forEach(press);
  expect(onUnlock).toHaveBeenCalledTimes(1);
});

it('does not fire on partial sequences', () => {
  const onUnlock = vi.fn();
  renderHook(() => useKonami({ onUnlock }));
  ['ArrowUp', 'ArrowUp', 'ArrowDown'].forEach(press);
  expect(onUnlock).not.toHaveBeenCalled();
});

it('restarts cleanly when the first key repeats mid-sequence', () => {
  const onUnlock = vi.fn();
  renderHook(() => useKonami({ onUnlock }));
  // Up Up (restart point) then full sequence from the second Up
  press('ArrowUp');
  press('ArrowUp');
  ['ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'].forEach(press);
  expect(onUnlock).toHaveBeenCalledTimes(1);
});
