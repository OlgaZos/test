const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const svg = (body, label = "") => `
  <svg viewBox="0 0 100 82" role="img" aria-label="${escapeHtml(label)}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#ffd762"/><stop offset="1" stop-color="#df8a26"/>
      </linearGradient>
      <linearGradient id="green" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#8eaa59"/><stop offset="1" stop-color="#4f754d"/>
      </linearGradient>
      <linearGradient id="red" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#f58a54"/><stop offset="1" stop-color="#c94c30"/>
      </linearGradient>
    </defs>
    ${body}
  </svg>`;

export function iconSvg(name, label) {
  const icons = {
    leaf: svg(
      `<path d="M16 60C14 30 37 12 81 14c-2 38-23 57-54 49" fill="url(#gold)"/>
       <path d="M21 68c13-17 29-29 50-42M43 49l-2-20M49 44l18 2" fill="none" stroke="#9d5d24" stroke-width="5" stroke-linecap="round"/>`,
      label
    ),
    mushroom: svg(
      `<path d="M39 42h22l8 30H32z" fill="#f0ddbd"/>
       <path d="M18 42C21 18 37 8 51 8s31 11 34 34z" fill="url(#red)"/>
       <circle cx="39" cy="24" r="5" fill="#fff2d0"/><circle cx="65" cy="31" r="4" fill="#fff2d0"/>
       <path d="M31 69c11 5 27 5 38 0" fill="none" stroke="#c7a978" stroke-width="4" stroke-linecap="round"/>`,
      label
    ),
    cool: svg(
      `<circle cx="48" cy="30" r="20" fill="#b9d8dc"/>
       <path d="M16 65c13-15 21 11 35-3 14-14 22 6 34-4" fill="none" stroke="#6d9da8" stroke-width="7" stroke-linecap="round"/>
       <path d="M52 9v42M32 30h40M38 16l28 28M66 16L38 44" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
      label
    ),
    rain: svg(
      `<path d="M22 48c-9-13 2-26 15-24C43 7 70 8 75 27c15 1 17 21 3 24H29z" fill="#91adb0"/>
       <path d="M31 58l-5 12M51 57l-5 14M71 57l-5 13" stroke="#4f8aa5" stroke-width="6" stroke-linecap="round"/>`,
      label
    ),
    snowman: svg(
      `<circle cx="50" cy="54" r="24" fill="#edf4f2" stroke="#b8d1d1" stroke-width="3"/>
       <circle cx="50" cy="22" r="16" fill="#f7fbfa" stroke="#b8d1d1" stroke-width="3"/>
       <path d="M48 24l13 3-13 4z" fill="#eb8134"/><circle cx="44" cy="18" r="2.5" fill="#273b3d"/><circle cx="55" cy="18" r="2.5" fill="#273b3d"/>
       <path d="M32 8h37M38 7l4-12h18l5 12" fill="#536a55" stroke="#536a55" stroke-width="5"/>`,
      label
    ),
    flower: svg(
      `<path d="M50 43v31M49 58c-13-11-25-3-24 8 11 1 20-2 24-8M51 64c11-10 21-4 21 5-9 2-17 0-21-5" fill="none" stroke="#5f874f" stroke-width="6" stroke-linecap="round"/>
       <circle cx="50" cy="28" r="9" fill="#f2aa2f"/>
       <circle cx="50" cy="12" r="12" fill="#ef7d99"/><circle cx="66" cy="27" r="12" fill="#ef7d99"/>
       <circle cx="50" cy="44" r="12" fill="#ef7d99"/><circle cx="34" cy="27" r="12" fill="#ef7d99"/>`,
      label
    ),
    nut: svg(
      `<path d="M27 34c0-17 11-26 23-26s23 9 23 26c0 24-12 41-23 41S27 58 27 34z" fill="url(#gold)" stroke="#995d28" stroke-width="4"/>
       <path d="M50 10c-5 17-4 38 0 62M32 31c12 5 24 5 36 0" fill="none" stroke="#b36d2c" stroke-width="4"/>`,
      label
    ),
    acorn: svg(
      `<path d="M36 31c-4 10-5 27 1 37 5 9 19 10 26 2 9-10 8-28 2-39z" fill="url(#gold)" stroke="#9c632f" stroke-width="4"/>
       <path d="M29 33c3-14 15-20 25-20s22 7 24 21c-17 5-33 5-49-1z" fill="#8d6237"/>
       <path d="M53 15C50 8 53 3 60 1" fill="none" stroke="#6e4b2e" stroke-width="5" stroke-linecap="round"/>`,
      label
    ),
    cone: svg(
      `<path d="M49 5c18 14 29 37 23 58-4 14-14 17-23 17s-19-3-23-17C21 42 31 19 49 5z" fill="#9f6b3c"/>
       <g fill="#d29a58" stroke="#704a2f" stroke-width="2">
         <path d="M49 13l12 12-12 9-12-9z"/><path d="M38 29l11 9-12 12-11-9z"/><path d="M60 29l12 12-11 9-12-12z"/>
         <path d="M49 40l12 12-12 12-12-12z"/><path d="M36 50l13 15-9 9-12-13z"/><path d="M62 50l9 11-12 13-10-9z"/>
       </g>`,
      label
    ),
    seeds: svg(
      `<path d="M20 63c8-27 22-43 49-50-3 29-19 48-49 50z" fill="url(#green)"/>
       <path d="M25 66c17-23 30-36 43-47" stroke="#355f3c" stroke-width="4" stroke-linecap="round"/>
       <ellipse cx="65" cy="60" rx="7" ry="13" fill="#d3a04b" transform="rotate(28 65 60)"/>
       <ellipse cx="79" cy="47" rx="6" ry="11" fill="#e0b25b" transform="rotate(-15 79 47)"/>`,
      label
    ),
    car: svg(
      `<path d="M18 58V40l14-20h34l16 20v18z" fill="#df5944" stroke="#9c3b32" stroke-width="4" stroke-linejoin="round"/>
       <path d="M36 25h27l10 15H27z" fill="#aad0d6"/>
       <circle cx="32" cy="61" r="10" fill="#394348"/><circle cx="68" cy="61" r="10" fill="#394348"/>
       <circle cx="32" cy="61" r="4" fill="#ccd1cb"/><circle cx="68" cy="61" r="4" fill="#ccd1cb"/>`,
      label
    ),
    candy: svg(
      `<path d="M29 31l-18-9 5 18-8 17 20-6M71 31l18-9-5 18 8 17-20-6" fill="#ed7f65" stroke="#b94a47" stroke-width="4" stroke-linejoin="round"/>
       <rect x="27" y="21" width="46" height="42" rx="15" fill="url(#red)" stroke="#b94a47" stroke-width="4"/>
       <path d="M37 31l26 22M62 31L38 53" stroke="#ffd5b8" stroke-width="5" stroke-linecap="round"/>`,
      label
    ),
    ball: svg(
      `<circle cx="50" cy="41" r="34" fill="#f3ba3f" stroke="#b8782a" stroke-width="4"/>
       <path d="M18 40c18-7 32-18 39-32M43 74c2-18 14-33 39-39M24 59c20 1 38 7 52 18" fill="none" stroke="#4f8463" stroke-width="6"/>`,
      label
    )
  };

  return icons[name] || svg(`<circle cx="50" cy="41" r="30" fill="url(#gold)"/>`, label);
}

function progressMarkup(index, total) {
  const percent = ((index + 1) / total) * 100;
  return `
    <div class="task-topline" aria-label="Задание ${index + 1} из ${total}">
      <span class="progress-copy">${index + 1} из ${total}</span>
      <div class="progress-track" aria-hidden="true"><span style="width:${percent}%"></span></div>
    </div>`;
}

function taskShell(task, meta, body) {
  return `
    <div class="task-screen">
      ${progressMarkup(meta.index, meta.total)}
      <div class="task-heading">
        <div>
          <h1>${escapeHtml(task.title)}</h1>
          <p>${escapeHtml(task.instruction)}</p>
        </div>
        <img class="task-kro" src="${escapeHtml(meta.kro)}" alt="Кро" />
      </div>
      <div class="task-body">
        ${body}
        <div class="feedback" id="feedback" role="status"></div>
        <div class="task-actions" id="taskActions"></div>
      </div>
    </div>`;
}

function setFeedback(message, kind = "gentle") {
  const feedback = document.querySelector("#feedback");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = `feedback feedback--${kind} is-visible`;
}

function clearFeedback() {
  const feedback = document.querySelector("#feedback");
  if (!feedback) return;
  feedback.textContent = "";
  feedback.className = "feedback";
}

function setActionButton(label, className, onClick) {
  const host = document.querySelector("#taskActions");
  if (!host) return null;
  host.replaceChildren();
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  host.append(button);
  return button;
}

function solveTask(task, callbacks) {
  setFeedback(task.success, "success");
  callbacks.onSolved(task.success);
  setActionButton("Дальше", "primary-button", callbacks.onComplete)?.focus();
}

export function renderCover(app, content, callbacks) {
  const parade = ["fox", "hare", "bear", "squirrel", "hedgehog"]
    .map(
      (key) =>
        `<img src="${escapeHtml(content.images[key])}" alt="${escapeHtml(
          { fox: "Лиса", hare: "Заяц", bear: "Медведь", squirrel: "Белка", hedgehog: "Ёж" }[key]
        )}" />`
    )
    .join("");

  app.innerHTML = `
    <div class="cover">
      <div class="cover__copy">
        <p class="eyebrow">${escapeHtml(content.series)}</p>
        <h1>${escapeHtml(content.title)}<span>${escapeHtml(content.subtitle)}</span></h1>
        <div class="cover__meta">
          <span>${escapeHtml(content.age)}</span>
          <span>${escapeHtml(content.duration)}</span>
          <span>${content.tasks.length} заданий</span>
        </div>
        <p class="kro-speech">${escapeHtml(content.intro.text)}</p>
        <button class="primary-button" id="startGame" type="button">${callbacks.resume ? "Продолжить игру" : "Начать игру"}</button>
        ${callbacks.resume ? `<p class="resume-note">Продолжим с задания ${callbacks.resume} из ${content.tasks.length}</p>` : ""}
      </div>
      <div class="cover__visual" aria-label="Кро и лесные животные">
        <span class="cover__sun" aria-hidden="true"></span>
        <img class="cover__kro" src="${escapeHtml(content.images.kro)}" alt="Кро — мальчик-исследователь" />
        <div class="animal-parade">${parade}</div>
      </div>
    </div>`;

  app.querySelector("#startGame").addEventListener("click", callbacks.onStart);
}

function renderMultiSelect(app, task, meta, callbacks) {
  const cards = task.options
    .map(
      (option) => `
        <button class="choice-card" type="button" data-id="${escapeHtml(option.id)}" aria-pressed="false">
          <span class="option-icon">${iconSvg(option.icon, option.label)}</span>
          <span class="choice-card__label">${escapeHtml(option.label)}</span>
        </button>`
    )
    .join("");

  app.innerHTML = taskShell(task, meta, `<div class="choice-grid">${cards}</div>`);
  const selected = new Set();

  app.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      selected.has(id) ? selected.delete(id) : selected.add(id);
      card.classList.toggle("is-selected", selected.has(id));
      card.setAttribute("aria-pressed", String(selected.has(id)));
      clearFeedback();
    });
  });

  setActionButton("Проверить", "check-button", () => {
    const correct = task.options.filter((option) => option.correct).map((option) => option.id);
    const exact = correct.length === selected.size && correct.every((id) => selected.has(id));
    if (exact) solveTask(task, callbacks);
    else {
      setFeedback(task.retry, "gentle");
      callbacks.onNarrate(task.retry);
    }
  });
}

function renderSelectToTarget(app, task, meta, callbacks) {
  const items = task.items
    .map(
      (item) => `
        <button class="item-card" type="button" draggable="true" data-id="${escapeHtml(item.id)}" aria-pressed="false">
          <span class="option-icon">${iconSvg(item.icon, item.label)}</span>
          <span class="item-card__label">${escapeHtml(item.label)}</span>
        </button>`
    )
    .join("");

  app.innerHTML = taskShell(
    task,
    meta,
    `<div class="pantry-layout">
      <div class="item-grid" id="itemGrid">${items}</div>
      <button class="pantry" id="pantry" type="button">
        <img class="pantry__animal" src="${escapeHtml(task.target.image)}" alt="" />
        <span>
          <span class="pantry__title">${escapeHtml(task.target.label)}</span>
          <span class="pantry__hint" id="pantryHint">${escapeHtml(task.target.hint)}</span>
          <span class="pantry__contents" id="pantryContents"></span>
        </span>
      </button>
    </div>`
  );

  const selected = { id: null };
  const stored = new Set();
  const pantry = app.querySelector("#pantry");
  const contents = app.querySelector("#pantryContents");
  const hint = app.querySelector("#pantryHint");

  function selectItem(id) {
    if (stored.has(id)) return;
    selected.id = selected.id === id ? null : id;
    app.querySelectorAll(".item-card").forEach((card) => {
      const active = card.dataset.id === selected.id;
      card.classList.toggle("is-selected", active);
      card.setAttribute("aria-pressed", String(active));
    });
    pantry.classList.toggle("is-ready", Boolean(selected.id));
    hint.textContent = selected.id ? "Теперь нажми на кладовую" : task.target.hint;
    clearFeedback();
  }

  function updatePantry() {
    app.querySelectorAll(".item-card").forEach((card) => {
      card.classList.toggle("is-in-target", stored.has(card.dataset.id));
    });
    contents.innerHTML = [...stored]
      .map((id) => {
        const item = task.items.find((entry) => entry.id === id);
        return `<span class="pantry-chip" data-id="${escapeHtml(id)}">${escapeHtml(item.label)} ×</span>`;
      })
      .join("");
    hint.textContent = stored.size ? "Нажми на предмет здесь, чтобы вернуть" : task.target.hint;
    selected.id = null;
    pantry.classList.remove("is-ready");
    clearFeedback();
  }

  function putInPantry(id) {
    if (!id || stored.has(id)) return;
    stored.add(id);
    updatePantry();
    callbacks.onNarrate(`${task.items.find((item) => item.id === id).label} — в кладовой.`);
  }

  app.querySelectorAll(".item-card").forEach((card) => {
    card.addEventListener("click", () => selectItem(card.dataset.id));
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.id);
      event.dataTransfer.effectAllowed = "move";
    });
  });

  pantry.addEventListener("click", (event) => {
    const chip = event.target.closest(".pantry-chip");
    if (chip) {
      event.stopPropagation();
      stored.delete(chip.dataset.id);
      updatePantry();
      return;
    }
    putInPantry(selected.id);
  });
  pantry.addEventListener("dragover", (event) => {
    event.preventDefault();
    pantry.classList.add("is-ready");
  });
  pantry.addEventListener("dragleave", () => pantry.classList.toggle("is-ready", Boolean(selected.id)));
  pantry.addEventListener("drop", (event) => {
    event.preventDefault();
    putInPantry(event.dataTransfer.getData("text/plain"));
  });

  setActionButton("Проверить запасы", "check-button", () => {
    const correct = task.items.filter((item) => item.correct).map((item) => item.id);
    const exact = correct.length === stored.size && correct.every((id) => stored.has(id));
    if (exact) solveTask(task, callbacks);
    else {
      setFeedback(task.retry, "gentle");
      callbacks.onNarrate(task.retry);
    }
  });
}

function renderMatchPairs(app, task, meta, callbacks) {
  const animals = task.left
    .map(
      (animal) => `
        <button class="animal-card" type="button" data-id="${escapeHtml(animal.id)}" aria-pressed="false">
          <img src="${escapeHtml(animal.image)}" alt="" />
          <span>${escapeHtml(animal.label)}</span>
        </button>`
    )
    .join("");
  const rotatedActions = [...task.right.slice(2), ...task.right.slice(0, 2)];
  const actions = rotatedActions
    .map(
      (action) =>
        `<button class="action-card" type="button" data-id="${escapeHtml(action.id)}" aria-pressed="false">${escapeHtml(action.label)}</button>`
    )
    .join("");

  app.innerHTML = taskShell(
    task,
    meta,
    `<div class="match-layout">
      <div class="animals-column">${animals}</div>
      <div class="actions-column">${actions}</div>
    </div>
    <p class="match-count" id="matchCount">Собрано пар: 0 из ${task.left.length}</p>`
  );

  let animalId = null;
  let actionId = null;
  let solved = false;
  const matchedAnimals = new Set();
  const matchedActions = new Set();

  function paintSelection() {
    app.querySelectorAll(".animal-card").forEach((card) => {
      card.classList.toggle("is-selected", card.dataset.id === animalId);
      card.classList.toggle("is-matched", matchedAnimals.has(card.dataset.id));
      card.setAttribute("aria-pressed", String(card.dataset.id === animalId));
      card.disabled = matchedAnimals.has(card.dataset.id);
    });
    app.querySelectorAll(".action-card").forEach((card) => {
      card.classList.toggle("is-selected", card.dataset.id === actionId);
      card.classList.toggle("is-matched", matchedActions.has(card.dataset.id));
      card.setAttribute("aria-pressed", String(card.dataset.id === actionId));
      card.disabled = matchedActions.has(card.dataset.id);
    });
  }

  function tryPair() {
    if (!animalId || !actionId || solved) return;
    if (task.pairs[animalId] === actionId) {
      matchedAnimals.add(animalId);
      matchedActions.add(actionId);
      const animal = task.left.find((item) => item.id === animalId);
      const action = task.right.find((item) => item.id === actionId);
      callbacks.onNarrate(`${animal.label} — ${action.label.toLowerCase()}.`);
      clearFeedback();
    } else {
      setFeedback(task.retry, "gentle");
      callbacks.onNarrate(task.retry);
    }
    animalId = null;
    actionId = null;
    paintSelection();
    app.querySelector("#matchCount").textContent = `Собрано пар: ${matchedAnimals.size} из ${task.left.length}`;

    if (matchedAnimals.size === task.left.length) {
      solved = true;
      solveTask(task, callbacks);
    }
  }

  app.querySelectorAll(".animal-card").forEach((card) => {
    card.addEventListener("click", () => {
      animalId = card.dataset.id;
      clearFeedback();
      paintSelection();
      tryPair();
    });
  });
  app.querySelectorAll(".action-card").forEach((card) => {
    card.addEventListener("click", () => {
      actionId = card.dataset.id;
      clearFeedback();
      paintSelection();
      tryPair();
    });
  });
}

function renderRiddleReveal(app, task, meta, callbacks) {
  app.innerHTML = taskShell(
    task,
    meta,
    `<div class="riddle-layout">
      <div class="riddle-card"><p>${escapeHtml(task.riddle)}</p></div>
      <div id="riddleStage">
        <p class="parent-hint">Дайте ребёнку время ответить вслух. Записывать ответ не нужно.</p>
      </div>
    </div>`
  );

  const stage = app.querySelector("#riddleStage");

  setActionButton(task.steps.answered, "primary-button", () => {
    stage.innerHTML = `<p class="parent-hint">Готово? Теперь можно проверить догадку.</p>`;
    setActionButton(task.steps.reveal, "secondary-button", () => {
      stage.innerHTML = `
        <div class="riddle-answer">
          <img src="${escapeHtml(task.answerImage)}" alt="${escapeHtml(task.answer)}" />
          <div>
            <strong>${escapeHtml(task.answer)}</strong>
            <p>${escapeHtml(task.speechPrompt)}</p>
          </div>
        </div>
        <p class="parent-hint">${escapeHtml(task.parentHint)}</p>`;
      callbacks.onNarrate(`${task.answer}. ${task.speechPrompt}`);
      setActionButton(task.steps.saidSentence, "primary-button", () => solveTask(task, callbacks));
    });
  });
}

function renderTrueFalse(app, task, meta, callbacks) {
  let index = 0;
  let locked = false;

  app.innerHTML = taskShell(
    task,
    meta,
    `<div id="truthStage"></div>
     <div class="truth-buttons">
       <button class="truth-button" data-value="true" type="button">${escapeHtml(task.labels.true)}</button>
       <button class="truth-button" data-value="false" type="button">${escapeHtml(task.labels.false)}</button>
     </div>`
  );

  const stage = app.querySelector("#truthStage");
  const buttons = [...app.querySelectorAll(".truth-button")];

  function showStatement() {
    const statement = task.statements[index];
    stage.innerHTML = `
      <div class="truth-card">
        <div>
          <p class="statement-count">Фраза ${index + 1} из ${task.statements.length}</p>
          <p class="statement">${escapeHtml(statement.text)}</p>
        </div>
      </div>`;
    buttons.forEach((button) => (button.disabled = false));
    locked = false;
    clearFeedback();
    setActionButton("", "is-hidden", () => {});
    callbacks.onNarrate(statement.text);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (locked) return;
      const statement = task.statements[index];
      const answer = button.dataset.value === "true";
      if (answer !== statement.answer) {
        setFeedback(task.retry, "gentle");
        callbacks.onNarrate(task.retry);
        return;
      }

      locked = true;
      buttons.forEach((entry) => (entry.disabled = true));
      stage.insertAdjacentHTML(
        "beforeend",
        `<p class="truth-explanation">${escapeHtml(statement.explanation)}</p>`
      );
      callbacks.onNarrate(statement.explanation);

      if (index === task.statements.length - 1) {
        solveTask(task, callbacks);
      } else {
        setActionButton(task.labels.next, "primary-button", () => {
          index += 1;
          showStatement();
        });
      }
    });
  });

  showStatement();
}

export function renderTask(app, task, meta, callbacks) {
  const renderers = {
    multiSelect: renderMultiSelect,
    selectToTarget: renderSelectToTarget,
    matchPairs: renderMatchPairs,
    riddleReveal: renderRiddleReveal,
    trueFalse: renderTrueFalse
  };
  const renderer = renderers[task.type];
  if (!renderer) throw new Error(`Unsupported task type: ${task.type}`);
  renderer(app, task, meta, callbacks);
}

export function renderFinal(app, content, callbacks) {
  app.innerHTML = `
    <div class="final">
      <div class="final__content">
        <p class="eyebrow">${escapeHtml(content.series)}</p>
        <h1>${escapeHtml(content.final.title)}</h1>
        <p class="final__text">${escapeHtml(content.final.text)}</p>
        <div class="award" aria-label="Награда: ${escapeHtml(content.final.award)}">
          <span>${escapeHtml(content.final.award)}</span>
        </div>
        <div class="button-row">
          <button class="primary-button" id="replayGame" type="button">${escapeHtml(content.final.replay)}</button>
          <a class="secondary-button" id="returnToSite" href="${escapeHtml(content.siteUrl)}">${escapeHtml(content.final.returnToSite)}</a>
        </div>
      </div>
      <div class="final__visual">
        <img src="${escapeHtml(content.images.kro)}" alt="Кро поздравляет ребёнка" />
      </div>
    </div>`;

  app.querySelector("#replayGame").addEventListener("click", callbacks.onReplay);
  app.querySelector("#returnToSite").addEventListener("click", callbacks.onReturnToSite);
}

export function renderError(app) {
  app.innerHTML = `
    <div class="loading">
      <div class="loading__leaf" aria-hidden="true">🍂</div>
      <h1>Игра не загрузилась</h1>
      <p>Проверьте интернет и обновите страницу.</p>
      <button class="primary-button" type="button" onclick="location.reload()">Обновить</button>
    </div>`;
}
