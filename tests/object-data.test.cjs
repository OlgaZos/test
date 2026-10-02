const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { APARTMENT_SOURCE, makeInitialState, validateState, areaSummary, numeric } = require('../object-data.js');

test('object has three living rooms and four separate service rooms, without fabricated areas', () => {
  const state = makeInitialState();
  assert.equal(state.rooms.length, 7);
  assert.equal(APARTMENT_SOURCE.rooms.filter(room => room.kind === 'living').length, 3);
  assert.deepEqual(state.rooms.map(room => room.id), ['corridor', 'bathroom', 'toilet', 'kitchen', 'room-1', 'living', 'room-3']);
  assert.ok(state.rooms.every(room => room.size === '' && room.areaMin === '' && room.areaMax === '' && room.height === ''));
  assert.equal(state.rooms.find(room => room.id === 'room-1').purpose, '');
  assert.equal(state.project.totalArea, '58');
  assert.equal(state.project.areaStatus, 'Ориентир');
  assert.equal(validateState(state), state);
});

test('unknown and partial areas never imply that apartment areas reconcile', () => {
  const state = makeInitialState();
  assert.deepEqual(areaSummary(state), { count: 0, total: 7, sum: 0, delta: null });
  state.rooms[0].areaMin = '6'; state.rooms[0].areaMax = '8'; state.rooms[0].areaBasis = 'Тестовая оценка';
  assert.equal(areaSummary(state).count, 0);
  state.rooms[1].size = '2.8'; state.rooms[1].measurementBasis = 'Тестовый обмер';
  assert.deepEqual(areaSummary(state), { count: 1, total: 7, sum: 2.8, delta: null });
  state.rooms.forEach(room => { room.size = '8'; room.measurementBasis = 'Тест'; });
  assert.equal(areaSummary(state).delta, 2);
});

test('areas require positive numbers, complete ranges and provenance', () => {
  for (const value of ['0', '-1', 'Infinity', 'not a number']) {
    const state = makeInitialState(); state.rooms[0].size = value;
    assert.throws(() => validateState(state));
  }
  const state = makeInitialState();
  state.rooms[0].areaMin = '8';
  assert.throws(() => validateState(state), /обе границы/);
  state.rooms[0].areaMax = '7';
  assert.throws(() => validateState(state), /больше верхней/);
  state.rooms[0].areaMax = '9';
  assert.throws(() => validateState(state), /основание оценки/);
  state.rooms[0].areaBasis = 'Тест'; state.rooms[0].size = '8.2';
  assert.throws(() => validateState(state), /источник и дату/);
  state.rooms[0].measurementBasis = 'Тестовый обмер';
  assert.doesNotThrow(() => validateState(state));
  assert.equal(numeric(''), null);
});

test('portable copy roundtrip preserves edits and attachments, keeping original independent', () => {
  const state = makeInitialState();
  state.rooms[4].palette = '<img src=x onerror=alert(1)> — текст';
  state.rooms[4].files = [{ name: 'test.pdf', data: 'data:application/pdf;base64,JVBERi0x' }];
  const restored = validateState(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored, state);
  restored.rooms[4].name = 'Новое название';
  assert.notEqual(restored.rooms[4].name, state.rooms[4].name);
  assert.equal(makeInitialState().rooms[4].palette, '');
});

test('rejects wrong object, missing/duplicate rooms, broken fields and executable attachments', () => {
  for (const mutate of [
    s => { s.objectId = 'other'; }, s => { s.schemaVersion = 99; },
    s => s.rooms.pop(), s => { s.rooms[1].id = s.rooms[0].id; },
    s => { s.rooms[0].name = 123; }, s => { s.rooms[0].stage = 'Выдано'; },
    s => { s.rooms[0].files = [{ name: 'x.html', data: 'javascript:alert(1)' }]; },
    s => { s.rooms[0].files = [{ name: 'x.svg', data: 'data:image/svg+xml;base64,PHN2Zz4=' }]; }
  ]) {
    const state = makeInitialState(); mutate(state);
    assert.throws(() => validateState(state));
  }
});

test('HTML supplies every editable model field and has no old sample rooms or completed-plan claim', () => {
  const html = readFileSync(require.resolve('../index.html'), 'utf8');
  const state = makeInitialState();
  for (const key of Object.keys(state.project)) assert.ok(html.includes('id="project-' + key + '"'), key);
  for (const key of Object.keys(state.rooms[0]).filter(key => !['id', 'files'].includes(key))) assert.ok(html.includes('id="room-' + key + '"'), key);
  assert.ok(!/Добавить типовые комнаты|План помещения получен|Кухня-гостиная/.test(html));
  assert.match(html, /name="viewport"/);
  const js = readFileSync(require.resolve('../planner.js'), 'utf8');
  assert.ok(!/innerHTML/.test(js));
});
