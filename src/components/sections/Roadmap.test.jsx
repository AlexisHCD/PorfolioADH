import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { roadmap } from '../../data/profile';
import Roadmap from './Roadmap';

it('renders all five semester titles', () => {
  render(<Roadmap />);
  roadmap.semesters.forEach((s) => {
    expect(screen.getByText(s.title)).toBeInTheDocument();
  });
});

it('renders exactly one "EN CURSO" pill', () => {
  render(<Roadmap />);
  expect(screen.getAllByText('EN CURSO')).toHaveLength(1);
});

it('renders the sub-line containing career name and SCT count', () => {
  render(<Roadmap />);
  expect(screen.getByText(new RegExp(roadmap.career))).toBeInTheDocument();
  expect(screen.getByText(new RegExp(`${roadmap.sct} SCT`))).toBeInTheDocument();
});

it('renders exactly 5 nodes', () => {
  render(<Roadmap />);
  expect(document.querySelectorAll('[data-tl-node]')).toHaveLength(5);
});
