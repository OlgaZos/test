import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const gameDir = resolve(here, "../games/autumn-animals");
const content = JSON.parse(await readFile(resolve(gameDir, "game.json"), "utf8"));
const audio = JSON.parse(
  await readFile(resolve(gameDir, "assets/audio/manifest.json"), "utf8")
);

assert.equal(content.schemaVersion, 1);
assert.equal(content.tasks.length, 5, "У игры должно быть ровно 5 заданий");
assert.deepEqual(
  content.tasks.map((task) => task.type),
  ["multiSelect", "selectToTarget", "matchPairs", "riddleReveal", "trueFalse"]
);
assert.ok(content.final.award);
assert.ok(content.siteUrl.startsWith("https://"));

const imagePaths = new Set(Object.values(content.images));
for (const task of content.tasks) {
  if (task.target?.image) imagePaths.add(task.target.image);
  if (task.answerImage) imagePaths.add(task.answerImage);
  task.left?.forEach((item) => item.image && imagePaths.add(item.image));
}

for (const imagePath of imagePaths) {
  await access(resolve(gameDir, imagePath));
}

const spokenTexts = new Set([content.intro.voice, content.final.voice]);
for (const [index, task] of content.tasks.entries()) {
  spokenTexts.add(task.voice);
  spokenTexts.add(task.success);
  if (task.retry) spokenTexts.add(task.retry);

  if (task.type === "selectToTarget") {
    task.items.forEach((item) => spokenTexts.add(`${item.label} — в кладовой.`));
  }

  if (task.type === "matchPairs") {
    task.left.forEach((animal) => {
      const action = task.right.find((entry) => entry.id === task.pairs[animal.id]);
      assert.ok(action, `Не найдено действие для ${animal.id} в задании ${index + 1}`);
      spokenTexts.add(`${animal.label} — ${action.label.toLowerCase()}.`);
    });
  }

  if (task.type === "riddleReveal") {
    spokenTexts.add(`${task.answer}. ${task.speechPrompt}`);
  }

  if (task.type === "trueFalse") {
    task.statements.forEach((statement) => {
      spokenTexts.add(statement.text);
      spokenTexts.add(statement.explanation);
    });
  }
}

assert.match(audio.voice, /Dmitry/i, "Для Кро должен использоваться мужской голос Дмитрия");
for (const text of spokenTexts) {
  const audioPath = audio.clips[text];
  assert.ok(audioPath, `Нет аудиофайла для реплики: ${text}`);
  await access(resolve(gameDir, audioPath));
}

const multiSelect = content.tasks.find((task) => task.type === "multiSelect");
assert.equal(multiSelect.options.filter((item) => item.correct).length, 4);

const pantry = content.tasks.find((task) => task.type === "selectToTarget");
assert.equal(pantry.items.filter((item) => item.correct).length, 4);

const matching = content.tasks.find((task) => task.type === "matchPairs");
assert.equal(matching.left.length, 4);
assert.equal(Object.keys(matching.pairs).length, 4);

const truth = content.tasks.find((task) => task.type === "trueFalse");
assert.equal(truth.statements.length, 4);

console.log(
  `✓ game.json, задания, изображения и ${spokenTexts.size} мужских аудиореплик проверены`
);
