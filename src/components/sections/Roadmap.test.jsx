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
  // the career name also appears in the semester-05 goal chip, so allow several
  expect(screen.getAllByText(new RegExp(roadmap.career)).length).toBeGreaterThan(0);
  expect(screen.getByText(new RegExp(`${roadmap.sct} SCT`))).toBeInTheDocument();
});

it('renders exactly 5 nodes', () => {
  render(<Roadmap />);
  expect(document.querySelectorAll('[data-tl-node]')).toHaveLength(5);
});
