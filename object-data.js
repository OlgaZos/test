// Состав подтверждён Ольгой 02.10.2026. Кадры видео пока не проверены.
// Не переносить сюда размеры из прежней гипотезы о двухкомнатной квартире.
const APARTMENT_SOURCE = {
  date: '2026-10-02',
  video: 'https://www.youtube.com/shorts/0UOrKV9scPc',
  videoStatus: 'Ролик не воспроизвёлся при проверке. Покадровый разбор не выполнен.',
  totalArea: 58,
  areaBasis: 'Ориентир со слов Ольги, без обмерного плана.',
  rooms: [
    { id: 'corridor', name: 'Коридор', kind: 'service',
      location: 'Коридор ведёт к кухне и жилым комнатам.',
      evidence: 'Наличие и направление движения подтверждены Ольгой.',
      unknowns: 'Геометрия, длина и ширина; расположение входной двери и дверей санузлов.',
      survey: 'Снять длины всех участков, ширину проходов, размеры и открывание дверей. Отметить щиток и перепады пола.' },
    { id: 'bathroom', name: 'Ванная', kind: 'service',
      location: 'Отдельное помещение; положение относительно входа требует проверки.',
      evidence: 'Ольга перечислила ванную отдельно от санузла.',
      unknowns: 'Размеры, оборудование, стояки, вентиляция и точное положение двери.',
      survey: 'Обмерить помещение; зафиксировать оборудование, выводы воды, канализации и вентиляцию.' },
    { id: 'toilet', name: 'Туалет (отдельный санузел)', kind: 'service',
      location: 'Отдельно от ванной; положение двери требует проверки.',
      evidence: 'Отдельный санузел указан Ольгой.',
      unknowns: 'Размеры, стояки, ревизии и вентиляция.',
      survey: 'Обмерить помещение, отметить стояки, доступ к ревизиям, вентиляцию и открывание двери.' },
    { id: 'kitchen', name: 'Кухня', kind: 'service',
      location: 'Слева по коридору.',
      evidence: 'Положение слева подтверждено Ольгой. Кухня и гостиная — отдельные помещения.',
      unknowns: 'Размеры, окно, коммуникации и тип плиты.',
      survey: 'Обмерить стены и проёмы, отметить воду, канализацию, вентиляцию, плиту и розетки.' },
    { id: 'room-1', name: 'Комната 1 — закрытая', kind: 'living',
      location: 'Слева по коридору, непосредственно перед гостиной.',
      evidence: 'Ольга подтвердила третью жилую комнату: дверь закрыта, внутрь при съёмке не заходят.',
      unknowns: 'Внутренний вид, площадь, форма, окно и назначение комнаты.',
      survey: 'Получить съёмку внутри и обмеры. До этого не назначать спальней, детской или кабинетом.' },
    { id: 'living', name: 'Гостиная (зал)', kind: 'living',
      location: 'Прямо по коридору, после двери закрытой комнаты.',
      evidence: 'Зал и его место в последовательности подтверждены Ольгой.',
      unknowns: 'Размеры, проёмы, окна; точный путь в следующую комнату и проходной ли зал.',
      survey: 'Обмерить стены и проёмы; проверить, через какую дверь проходят в следующую комнату.' },
    { id: 'room-3', name: 'Комната 3 — после гостиной', kind: 'living',
      location: 'Следует после зала в описании маршрута.',
      evidence: 'Ещё одна жилая комната после зала подтверждена Ольгой.',
      unknowns: 'Вход из зала или отдельный; размеры, проёмы, окна и будущее назначение.',
      survey: 'Зафиксировать вход и связь с залом, обмерить стены и проёмы; согласовать назначение.' }
  ]
};

const ROOM_FIELDS = ['name', 'areaMin', 'areaMax', 'areaBasis', 'size', 'measurementBasis', 'height', 'purpose', 'style', 'palette', 'moodboard', 'visual', 'tasks', 'links', 'notes', 'stage'];
const PROJECT_FIELDS = ['name', 'owner', 'totalArea', 'areaStatus', 'planLink', 'style', 'links', 'notes'];
const STAGES = ['Обследование', 'Планировка', 'Палитра и материалы', 'Референсы', '3D', 'ТЗ строителям'];
const STORAGE_KEY = 'olga-apartment-0UOrKV9scPc-v1';

function makeInitialState() {
  return {
    schemaVersion: 1,
    objectId: '0UOrKV9scPc',
    project: {
      name: 'Трёхкомнатная квартира · около 58 м²', owner: 'Ольга',
      totalArea: '58', areaStatus: 'Ориентир', planLink: '', style: '', links: '',
      notes: 'Исходного плана нет. Основа состава помещений — уточнение Ольги от 02.10.2026. Стиль и назначение комнат 1 и 3 ещё не выбраны.'
    },
    rooms: APARTMENT_SOURCE.rooms.map(source => ({
      ...Object.fromEntries(ROOM_FIELDS.map(key => [key, ''])),
      id: source.id, name: source.name, stage: 'Обследование',
      purpose: source.id === 'living' ? 'Гостиная' : '', files: []
    }))
  };
}

function numeric(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : NaN;
}

// Imports are validated before replacing current work; unknown rooms never get silently dropped.
function validateState(value) {
  if (!value || value.schemaVersion !== 1 || value.objectId !== '0UOrKV9scPc' || !value.project || !Array.isArray(value.rooms)) throw Error('Это не файл проекта этой квартиры.');
  if (value.rooms.length !== APARTMENT_SOURCE.rooms.length) throw Error('В проекте должно быть семь подтверждённых помещений.');
  for (const key of PROJECT_FIELDS) if (typeof value.project[key] !== 'string') throw Error('Повреждены данные проекта.');
  const ids = new Set();
  for (const room of value.rooms) {
    if (!APARTMENT_SOURCE.rooms.some(source => source.id === room.id) || ids.has(room.id)) throw Error('Повтор или неизвестный код помещения.');
    ids.add(room.id);
    for (const key of ROOM_FIELDS) if (typeof room[key] !== 'string') throw Error('Повреждены поля помещения.');
    if (!room.name.trim() || !STAGES.includes(room.stage)) throw Error('Укажите название и этап помещения.');
    for (const key of ['areaMin', 'areaMax', 'size', 'height']) if (Number.isNaN(numeric(room[key]))) throw Error('Площадь и высота должны быть положительными числами.');
    if (Boolean(room.areaMin) !== Boolean(room.areaMax)) throw Error('Укажите обе границы ориентировочной площади.');
    if (room.areaMin && Number(room.areaMin) > Number(room.areaMax)) throw Error('Нижняя граница площади больше верхней.');
    if (room.areaMin && !room.areaBasis.trim()) throw Error('Укажите основание оценки площади: кадр, размер или расчёт.');
    if (room.size && !room.measurementBasis.trim()) throw Error('Для обмерной площади укажите источник и дату замера.');
    if (!Array.isArray(room.files) || room.files.length > 20) throw Error('Повреждён список файлов.');
    for (const file of room.files) {
      if (typeof file.name !== 'string' || typeof file.data !== 'string' || !/^data:(image\/(png|jpeg|webp)|application\/pdf);base64,[A-Za-z0-9+/=]+$/.test(file.data)) throw Error('Допустимы вложения PNG, JPG, WebP или PDF.');
    }
  }
  if (Number.isNaN(numeric(value.project.totalArea)) || !['Ориентир', 'По документу', 'По обмеру'].includes(value.project.areaStatus)) throw Error('Проверьте общую площадь и её статус.');
  return value;
}

function areaSummary(state) {
  const measured = state.rooms.filter(room => numeric(room.size) > 0);
  const sum = measured.reduce((total, room) => total + Number(room.size), 0);
  const complete = measured.length === state.rooms.length;
  return { count: measured.length, total: state.rooms.length, sum: Math.round(sum * 100) / 100,
    delta: complete && numeric(state.project.totalArea) > 0 ? Math.round((Number(state.project.totalArea) - sum) * 100) / 100 : null };
}

if (typeof module !== 'undefined') module.exports = { APARTMENT_SOURCE, makeInitialState, validateState, areaSummary, numeric };
