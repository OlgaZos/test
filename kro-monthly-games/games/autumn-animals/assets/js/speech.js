let enabled = false;
let currentAudio = null;
let audioClips = new Map();

export function configureSpeech(config) {
  audioClips = new Map(Object.entries(config?.clips || {}));
  if (!isSpeechSupported()) enabled = false;
}

export function isSpeechSupported() {
  return typeof window.Audio === "function" && audioClips.size > 0;
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(value) {
  enabled = Boolean(value && isSpeechSupported());
  if (!enabled) stopSpeaking();
  return enabled;
}

export function speak(text) {
  if (!enabled || !isSpeechSupported() || !text) return false;

  const source = audioClips.get(String(text));
  if (!source) {
    console.warn("Для реплики не найден готовый аудиофайл:", text);
    return false;
  }

  stopSpeaking();
  currentAudio = new Audio(source);
  currentAudio.preload = "auto";
  currentAudio.addEventListener(
    "ended",
    () => {
      currentAudio = null;
    },
    { once: true }
  );
  currentAudio.play().catch((error) => {
    console.warn("Браузер не разрешил воспроизвести реплику:", error);
  });
  return true;
}

export function stopSpeaking() {
  if (!currentAudio) return;
  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentAudio = null;
}
