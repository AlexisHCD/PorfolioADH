import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { useTheme } from './useTheme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

it('defaults to the dark night theme', () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('dark');
});

it('mirrors the theme onto <html data-theme>', () => {
  renderHook(() => useTheme());
  expect(document.documentElement.dataset.theme).toBe('dark');
});

it('toggles dark -> light and persists the choice', () => {
  const { result } = renderHook(() => useTheme());
  act(() => result.current.toggle());
  expect(result.current.theme).toBe('light');
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(localStorage.getItem('alexdevos-theme')).toBe('light');
});
