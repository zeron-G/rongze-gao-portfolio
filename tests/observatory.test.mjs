import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { projects, experience, education, person, publication } from '../src/observatory/content.js';

test('project catalog has unique, routable identifiers and complete bilingual cases', () => {
  assert.equal(projects.length, 12);
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length);
  for (const p of projects) {
    assert.match(p.id, /^[a-z0-9-]+$/);
    for (const field of ['summary', 'type', 'status', 'problem', 'evidence', 'boundary']) {
      assert.equal(p[field].length, 2, `${p.id}.${field}`);
      assert.ok(p[field].every(s => typeof s === 'string' && s.length > 0));
    }
    assert.ok(p.build.length > 0 && p.build.every(b => b.length === 2));
    assert.ok(p.links.length > 0);
    for (const [, url] of p.links) assert.equal(new URL(url).protocol, 'https:');
  }
});

test('three flagship projects and private access boundaries remain explicit', () => {
  assert.deepEqual(projects.filter(p => p.featured).map(p => p.id), ['anima-family', 'synapse', 'hapf']);
  assert.equal(projects.find(p => p.id === 'anima-family').private, true);
  assert.equal(projects.find(p => p.id === 'synapse').private, false);
  assert.match(projects.find(p => p.id === 'hapf').boundary[0], /Preclinical/);
  assert.match(projects.find(p => p.id === 'finrag').boundary[0], /team/i);
});

test('latest career corrections and paper identity are retained', () => {
  assert.equal(experience.find(e => e.id === 'ward').years, '2025.09 — 2026.01');
  assert.match(experience.find(e => e.id === 'tusk').role[0], /part-time/);
  assert.equal(experience.find(e => e.id === 'cdhai').years, '2026.01 — Present');
  assert.equal(education.length, 3);
  assert.equal(publication.doi, '10.54097/qw8hwy64');
  assert.equal(person.email, 'rgao28@jh.edu');
});

test('homepage retains accessible dialogs, metadata and legacy entry links', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../src/observatory/main.js', import.meta.url), 'utf8');
  assert.match(html, /aria-labelledby="dialog-title"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(app, /href="\/game.html"/);
  assert.match(app, /https:\/\/private.rongzegao.com/);
  assert.match(app, /noopener noreferrer/);
  assert.doesNotMatch(html + app + JSON.stringify({person, projects, experience}), /571-289|191-5793|F8282E|BEGIN PRIVATE KEY/);
});
