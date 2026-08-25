import { describe, expect, it } from 'vitest';
import {
  identity,
  social,
  projects,
  roadmap,
  certificates,
  stack,
} from './profile';

describe('profile data contract', () => {
  it('has complete identity', () => {
    for (const key of ['firstName', 'fullName', 'email', 'school', 'photo']) {
      expect(identity[key], `identity.${key}`).toBeTruthy();
    }
    expect(identity.email).toMatch(/@/);
  });

  it('links social profiles to real handles', () => {
    expect(social.github).toContain(social.githubUser);
    expect(social.linkedin).toContain('linkedin.com');
  });

  it('keeps roadmap consistent: 5 semesters, one current, node 4 is it', () => {
    expect(roadmap.semesters).toHaveLength(5);
    expect(roadmap.currentSemester).toBe(4);
    expect(roadmap.semesters.filter((s) => s.status === 'current')).toHaveLength(1);
    expect(roadmap.semesters.find((s) => s.status === 'current')?.n).toBe(
      roadmap.currentSemester,
    );
  });

  it('keeps unique project ids with at least one featured repo', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(projects.filter((p) => p.featured)).toHaveLength(1);
    expect(projects.find((p) => p.id === 'blackstone')?.privateRepo).toBe(true);
  });

  it('ships exactly two certificates with seal text in scene format', () => {
    expect(certificates.map((c) => c.id)).toEqual(['aiep', 'google']);
    for (const cert of certificates) {
      expect(cert.sealText).toMatch(/^· .* × .* ·$/);
      expect(cert.image).toMatch(/^\/img\/certs\//);
    }
  });

  it('groups the tech stack into non-empty categories', () => {
    expect(stack.length).toBeGreaterThanOrEqual(3);
    for (const group of stack) {
      expect(group.group).toBeTruthy();
      expect(group.items.length).toBeGreaterThan(0);
    }
  });
});
