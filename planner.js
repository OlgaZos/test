'use strict';

const $ = id => document.getElementById(id);
const format = number => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(number);
const MAX_BACKUP = 4 * 1024 * 1024;
let state = makeInitialState();
let editingId = null;
let draftFiles = [];
let dirty = false;
let invalidSavedCopy = false;
let volatileChanges = false;

function status(text) { $('storage-status').textContent = text; }
function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}
function paragraph(parent, label, value) {
  const p = node('p');
  p.append(node('strong', label + ': '), document.createTextNode(value || 'Пока не заполнено'));
  parent.append(p);
}
function areaText(room) {
  const parts = [];
  if (room.size) parts.push(format(Number(room.size)) + ' м² — по обмеру');
  if (room.areaMin && room.areaMax) parts.push(format(Number(room.areaMin)) + '–' + format(Number(room.areaMax)) + ' м² — оценка');
  return parts.join('; ') || 'Не определена';
}
function copyText(room) {
  const source = APARTMENT_SOURCE.rooms.find(item => item.id === room.id);
  return [room.name, 'Источник состава: уточнение Ольги, 02.10.2026. Видео пока не проверено.',
    'Положение: ' + source.location, 'Площадь: ' + areaText(room),
    'Основание оценки: ' + (room.areaBasis || '—'), 'Основание обмера: ' + (room.measurementBasis || '—'),
    'Что уточнить: ' + source.unknowns, 'Новые наблюдения: ' + (room.notes || '—'),
    'Назначение: ' + (room.purpose || 'Не определено'), 'Стиль: ' + (room.style || 'Не выбран'),
    'Палитра: ' + (room.palette || 'Не выбрана'), 'Референсы: ' + (room.moodboard || '—'),
    '3D: ' + (room.visual || '—'), 'ТЗ строителям: ' + (room.tasks || 'Не составлено'),
    'Ссылки: ' + (room.links || '—')].join('\n');
}
function render() {
  $('rooms').replaceChildren();
  $('room-nav').replaceChildren();
  $('structure-rows').replaceChildren();
  // Keep the route order stable even when an imported file lists rooms differently.
  for (const source of APARTMENT_SOURCE.rooms) {
    const room = state.rooms.find(item => item.id === source.id);
    const anchor = node('a', room.name);
    anchor.href = '#card-' + room.id;
    $('room-nav').append(anchor);
    const tr = node('tr');
    tr.append(node('th', room.name), node('td', source.location), node('td', areaText(room)));
    tr.firstChild.scope = 'row';
    $('structure-rows').append(tr);

    const card = node('article', undefined, 'room-card');
    card.id = 'card-' + room.id;
    const header = node('div', undefined, 'room-header');
    const title = node('div');
    title.append(node('h3', room.name), node('p', (source.kind === 'living' ? 'Жилая комната' : 'Вспомогательное помещение') + ' · ' + room.stage, 'small muted'));
    header.append(title, node('span', areaText(room), 'tag'));
    card.append(header);
    paragraph(card, 'Положение', source.location);
    const evidence = node('div', undefined, 'evidence');
    paragraph(evidence, 'Подтверждено Ольгой', source.evidence);
    paragraph(evidence, 'Открытые вопросы исходного разбора', source.unknowns);
    paragraph(evidence, 'Задача обследования', source.survey);
    card.append(evidence);
    if (room.areaMin) paragraph(card, 'Основание оценки площади', room.areaBasis);
    if (room.size) paragraph(card, 'Источник обмерной площади', room.measurementBasis);
    if (room.height) paragraph(card, 'Высота по обмеру', room.height + ' м');
    if (room.notes) paragraph(card, 'Новые наблюдения и решения', room.notes);
    paragraph(card, 'Будущее назначение', room.purpose || 'Не определено');
    paragraph(card, 'Стиль', room.style || 'Не выбран');
    paragraph(card, 'Палитра и материалы', room.palette || 'Не выбраны');
    paragraph(card, 'Референсы / мудборд', room.moodboard);
    paragraph(card, '3D / визуализация', room.visual || 'После обмеров и выбора планировки');
    paragraph(card, 'ТЗ строителям', room.tasks || 'Не составлено');
    if (room.links) paragraph(card, 'Ссылки', room.links);
    for (const file of room.files) {
      const link = node('a', file.name);
      link.href = file.data;
      link.download = file.name;
      const p = node('p'); p.append(link); card.append(p);
    }
    const actions = node('div', undefined, 'inline-actions');
    const edit = node('button', 'Редактировать');
    edit.type = 'button';
    edit.setAttribute('aria-label', 'Редактировать: ' + room.name);
    edit.addEventListener('click', () => openEditor(room.id));
    const copy = node('button', 'Скопировать карточку', 'ghost');
    copy.type = 'button';
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(copyText(room)); status('Карточка «' + room.name + '» скопирована.'); }
      catch { status('Буфер обмена недоступен. Можно скачать копию всего проекта.'); }
    });
    actions.append(edit, copy); card.append(actions); $('rooms').append(card);
  }
  const summary = areaSummary(state);
  const total = state.project.totalArea ? format(Number(state.project.totalArea)) + ' м² (' + state.project.areaStatus.toLowerCase() + ')' : 'не указана';
  $('area-summary').textContent = 'Общая площадь: ' + total + '. Обмерено: ' + summary.count + ' из ' + summary.total + ' помещений.'
    + (summary.count ? ' Сумма обмеров: ' + format(summary.sum) + ' м².' : '')
    + (summary.delta !== null ? ' Разница с общей площадью: ' + format(summary.delta) + ' м²; сопоставьте состав площадей в источниках.' : ' Сумма квартиры пока не рассчитана.');
}

function populateProject() {
  for (const key of PROJECT_FIELDS) $('project-' + key).value = state.project[key];
}
function persisted(next) {
  validateState(next);
  const json = JSON.stringify(next);
  if (new Blob([json]).size > MAX_BACKUP) throw Error('Копия больше 4 МБ. Уменьши вложения или замени их ссылками.');
  if (invalidSavedCopy && !confirm('В браузере есть повреждённая копия проекта. Заменить её текущей?')) return false;
  // Update state only after all validation. A quota error must not claim the save succeeded.
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, json);
    invalidSavedCopy = false;
    volatileChanges = false;
    status('Сохранено в этом браузере. Для переноса на другое устройство скачай копию.');
  } catch {
    volatileChanges = true;
    status('Сохранение в браузере недоступно. Правки есть только на этой странице — скачай копию до закрытия.');
  }
  return true;
}
function renderDraftFiles() {
  $('editor-files').replaceChildren();
  draftFiles.forEach((file, index) => {
    const row = node('div', undefined, 'file-row');
    row.append(node('span', file.name));
    const remove = node('button', 'Убрать вложение', 'ghost');
    remove.type = 'button';
    remove.setAttribute('aria-label', 'Убрать вложение: ' + file.name);
    remove.addEventListener('click', () => { draftFiles.splice(index, 1); dirty = true; renderDraftFiles(); });
    row.append(remove); $('editor-files').append(row);
  });
}
function openEditor(id) {
  if (dirty && !confirm('В форме есть несохранённые правки. Перейти к другому помещению?')) return;
  const room = state.rooms.find(item => item.id === id);
  editingId = id;
  draftFiles = structuredClone(room.files);
  $('room-form').reset();
  for (const key of ROOM_FIELDS) $('room-' + key).value = room[key];
  $('editor-title').textContent = room.name;
  $('room-error').textContent = '';
  $('room-editor').hidden = false;
  dirty = false;
  renderDraftFiles();
  $('room-editor').scrollIntoView({ block: 'start' });
  $('room-name').focus({ preventScroll: true });
}
function closeEditor() {
  $('room-editor').hidden = true;
  editingId = null;
  draftFiles = [];
  dirty = false;
}
function readAttachment(file) {
  if (file.size > 2 * 1024 * 1024) return Promise.reject(Error('Файл «' + file.name + '» больше 2 МБ. Добавь ссылку на него.'));
  if (!['image/png', 'image/jpeg', 'image/webp', 'application/pdf'].includes(file.type)) return Promise.reject(Error('Допустимы JPG, PNG, WebP и PDF.'));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, data: reader.result });
    reader.onerror = () => reject(Error('Не удалось прочитать «' + file.name + '».'));
    reader.readAsDataURL(file);
  });
}

for (const stage of STAGES) $('room-stage').append(node('option', stage));
$('room-form').addEventListener('input', () => { dirty = true; });
$('room-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!editingId) return;
  $('save-room').disabled = true;
  $('room-error').textContent = '';
  try {
    const roomId = editingId;
    const next = structuredClone(state);
    const room = next.rooms.find(item => item.id === roomId);
    for (const key of ROOM_FIELDS) room[key] = $('room-' + key).value.trim();
    room.files = [...draftFiles, ...await Promise.all(Array.from($('room-files').files).map(readAttachment))];
    if (!persisted(next)) return;
    closeEditor(); render();
    const card = $('card-' + roomId);
    card.scrollIntoView({ block: 'start' });
    card.querySelector('button').focus({ preventScroll: true });
  } catch (error) { $('room-error').textContent = error.message; }
  finally { $('save-room').disabled = false; }
});
$('cancel-edit').addEventListener('click', () => {
  if (dirty && !confirm('Отменить несохранённые правки помещения?')) return;
  const previousId = editingId;
  closeEditor();
  if (previousId) $('card-' + previousId).querySelector('button').focus();
});
let projectDirty = false;
$('project-form').addEventListener('input', () => { projectDirty = true; });
$('project-form').addEventListener('submit', event => {
  event.preventDefault();
  try {
    const next = structuredClone(state);
    for (const key of PROJECT_FIELDS) next.project[key] = $('project-' + key).value.trim();
    if (persisted(next)) { projectDirty = false; render(); }
  } catch (error) { status(error.message); }
});
$('export-project').addEventListener('click', () => {
  if (dirty || projectDirty) { status('Сначала сохрани правки открытой формы. Копия должна содержать последние изменения.'); return; }
  const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = node('a');
  link.href = url; link.download = 'apartment-58-project.json';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status('Копия проекта подготовлена к скачиванию. Она содержит сохранённые поля и вложения.');
});
$('import-project').addEventListener('click', () => $('import-file').click());
$('import-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > MAX_BACKUP) throw Error('Файл больше 4 МБ.');
    const next = validateState(JSON.parse(await file.text()));
    if (!confirm('Заменить текущие данные копией из файла? Скачай текущую копию заранее, если она нужна.')) return;
    if (!persisted(next)) return;
    closeEditor(); projectDirty = false; populateProject(); render();
  } catch (error) { status('Копия не загружена: ' + error.message); }
  finally { event.target.value = ''; }
});
window.addEventListener('beforeunload', event => {
  if (dirty || projectDirty || volatileChanges) { event.preventDefault(); event.returnValue = ''; }
});

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { state = validateState(JSON.parse(saved)); status('Загружена сохранённая копия этого проекта.'); }
    catch {
      invalidSavedCopy = true;
      status('Не удалось прочитать сохранённую копию. Исходная структура открыта; прежние данные не перезаписаны.');
    }
  } else status('Исходная структура загружена. Изменения сохраняются кнопками в формах.');
} catch {
  status('Хранилище этого браузера недоступно. После заполнения скачай копию до закрытия страницы.');
}
populateProject();
render();
