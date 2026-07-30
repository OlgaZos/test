import { trackEvent } from "./analytics.js";
import {
  configureSpeech,
  isSoundEnabled,
  isSpeechSupported,
  setSoundEnabled,
  speak,
  stopSpeaking
} from "./speech.js";
import { renderCover, renderError, renderFinal, renderTask } from "./renderer.js";

const app = document.querySelector("#app");
const soundToggle = document.querySelector("#soundToggle");
const soundLabel = soundToggle.querySelector(".sound-button__label");
const repeatTask = document.querySelector("#repeatTask");
const liveRegion = document.querySelector("#liveRegion");

let content;
let taskIndex = 0;
let currentVoiceText = "";
let currentScreen = "cover";

function readProgress() {
  if (!content) return 0;
  try {
    const saved = JSON.parse(localStorage.getItem(content.storageKey));
    const value = Number(saved?.taskIndex);
    return Number.isInteger(value) && value >= 0 && value < content.tasks.length ? value : 0;
  } catch {
    return 0;
  }
}

function saveProgress(index) {
  try {
    localStorage.setItem(
      content.storageKey,
      JSON.stringify({ taskIndex: index, updatedAt: new Date().toISOString() })
    );
  } catch {
    // Private browsing or embedded browsers can block storage. The game still works.
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(content.storageKey);
  } catch {
    // Nothing else is needed.
  }
}

function announce(message) {
  liveRegion.textContent = "";
  window.setTimeout(() => {
    liveRegion.textContent = message;
  }, 20);
}

function updateSoundButton() {
  const supported = isSpeechSupported();
  const enabled = isSoundEnabled();
  soundToggle.disabled = !supported;
  soundToggle.classList.toggle("is-on", enabled);
  soundToggle.setAttribute("aria-pressed", String(enabled));
  soundToggle.querySelector("span:first-child").textContent = enabled ? "🔊" : "🔈";
  soundLabel.textContent = supported ? (enabled ? "Выключить звук" : "Включить звук") : "Звук недоступен";
}

function setScreen(name, voiceText = "") {
  currentScreen = name;
  currentVoiceText = voiceText;
  repeatTask.classList.toggle("is-hidden", name !== "task");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCover() {
  setScreen("cover", content.intro.voice);
  const savedIndex = readProgress();
  renderCover(app, content, {
    resume: savedIndex > 0 ? savedIndex + 1 : null,
    onStart: () => {
      taskIndex = savedIndex;
      trackEvent("game_start", { resumed: taskIndex > 0, task_number: taskIndex + 1 });
      showTask();
    }
  });
}

function showTask() {
  const task = content.tasks[taskIndex];
  if (!task) {
    showFinal();
    return;
  }

  saveProgress(taskIndex);
  setScreen("task", task.voice);
  renderTask(
    app,
    task,
    {
      index: taskIndex,
      total: content.tasks.length,
      kro: content.images.kro
    },
    {
      onNarrate: (text) => {
        announce(text);
        speak(text);
      },
      onSolved: (message) => {
        trackEvent("task_complete", {
          task_id: task.id,
          task_type: task.type,
          task_number: taskIndex + 1
        });
        announce(message);
        speak(message);
      },
      onComplete: () => {
        taskIndex += 1;
        saveProgress(taskIndex);
        showTask();
      }
    }
  );

  speak(task.voice);
}

function showFinal() {
  saveProgress(content.tasks.length);
  setScreen("final", content.final.voice);
  renderFinal(app, content, {
    onReplay: () => {
      trackEvent("replay_click");
      clearProgress();
      taskIndex = 0;
      showCover();
    },
    onReturnToSite: () => trackEvent("return_to_site_click")
  });
  trackEvent("game_complete");
  announce(content.final.voice);
  speak(content.final.voice);
}

soundToggle.addEventListener("click", () => {
  const enabled = setSoundEnabled(!isSoundEnabled());
  updateSoundButton();
  trackEvent(enabled ? "sound_on" : "sound_off", { screen: currentScreen });
  if (enabled) speak(currentVoiceText);
});

repeatTask.addEventListener("click", () => {
  if (currentScreen !== "task") return;
  speak(currentVoiceText);
  announce(currentVoiceText);
});

window.addEventListener("pagehide", stopSpeaking);

async function init() {
  try {
    const [gameResponse, audioResponse] = await Promise.all([
      fetch("./game.json", { cache: "no-store" }),
      fetch("./assets/audio/manifest.json", { cache: "no-store" })
    ]);
    if (!gameResponse.ok) throw new Error(`game.json: ${gameResponse.status}`);
    if (!audioResponse.ok) throw new Error(`audio manifest: ${audioResponse.status}`);
    content = await gameResponse.json();
    configureSpeech(await audioResponse.json());
    taskIndex = readProgress();
    updateSoundButton();
    trackEvent("game_open", {
      age: content.age,
      saved_task_number: taskIndex + 1
    });
    showCover();
  } catch (error) {
    console.error(error);
    renderError(app);
  }
}

init();
