import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projects,experience,education,person,publication} from '../src/observatory/content.js';
test('existing bilingual project evidence and unique identifiers are retained',()=>{
  assert.equal(projects.length,12);assert.equal(new Set(projects.map(p=>p.id)).size,12);
  for(const p of projects){for(const f of ['summary','type','status','problem','evidence','boundary'])assert.ok(p[f].length===2&&p[f].every(s=>typeof s==='string'&&s.length));assert.ok(p.build.length);for(const [,url] of p.links)assert.equal(new URL(url).protocol,'https:');}
});
test('private, clinical and team scope remain explicit',()=>{
  assert.deepEqual(projects.filter(p=>p.featured).map(p=>p.id),['anima-family','synapse','hapf']);
  assert.equal(projects.find(p=>p.id==='anima-family').private,true);
  assert.match(projects.find(p=>p.id==='hapf').boundary[0],/Preclinical/);
  assert.match(projects.find(p=>p.id==='finrag').boundary[0],/team/i);
});
test('owner corrections and publication identity are unchanged',()=>{
  assert.equal(experience.find(e=>e.id==='ward').years,'2025.09 — 2026.01');
  assert.match(experience.find(e=>e.id==='tusk').role[0],/part-time/);
  assert.equal(education.length,3);assert.equal(publication.doi,'10.54097/qw8hwy64');assert.equal(person.email,'rgao28@jh.edu');
});
test('personal experience has accessible entry points and preserves CV/game/private space',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const app=readFileSync(new URL('../src/flightlog/main.js',import.meta.url),'utf8');
  assert.match(html,/aria-labelledby="detail-title"/);assert.match(html,/aria-labelledby="menu-title"/);
  assert.match(html,/class="skip"/);assert.match(html,/rel="canonical"/);assert.match(html,/application\/ld\+json/);
  assert.match(app,/resume\.html/);assert.match(app,/game\.html/);assert.match(app,/private\.rongzegao\.com/);
  assert.match(app,/data-reset-desk/);assert.match(app,/data-reset-flight/);
  assert.doesNotMatch(html+app,/571-289|191-5793|F8282E|BEGIN PRIVATE KEY/);
});
