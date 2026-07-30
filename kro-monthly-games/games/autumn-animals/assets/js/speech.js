const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
let enabled = false;
let russianVoice = null;

const maleVoiceHints = [
  "yuri",
  "юрий",
  "pavel",
  "павел",
  "dmitry",
  "дмитрий",
  "maxim",
  "максим",
  "alexander",
  "александр",
  "mikhail",
  "михаил",
  "nikolai",
  "николай",
  "male",
  "мужск*",
  "man",
  "boy"
];

const femaleVoiceHints = [
  "milena",
  "милена",
  "irina",
  "ирина",
  "svetlana",
  "светлана",
  "alena",
  "алёна",
  "katya",
  "катя",
  "female",
  "женск*",
  "woman",
  "girl"
];

function voiceIdentity(voice) {
  return `${voice?.name || ""} ${voice?.voiceURI || ""}`.toLowerCase();
}

function hasVoiceHint(voice, hints) {
  const identity = voiceIdentity(voice);
  const tokens = new Set(identity.split(/[^\p{L}\p{N}]+/gu).filter(Boolean));
  return hints.some((hint) =>
    hint.endsWith("*") ? identity.includes(hint.slice(0, -1)) : tokens.has(hint)
  );
}

function scoreRussianVoice(voice) {
  const language = (voice.lang || "").toLowerCase();
  let score = language === "ru-ru" ? 30 : 20;

  if (hasVoiceHint(voice, maleVoiceHints)) score += 100;
  if (hasVoiceHint(voice, femaleVoiceHints)) score -= 100;
  if (voice.localService) score += 1;

  return score;
}

function chooseRussianVoice() {
  if (!synth) return null;
  const voices = synth
    .getVoices()
    .filter((voice) => (voice.lang || "").toLowerCase().startsWith("ru"))
    .sort((first, second) => scoreRussianVoice(second) - scoreRussianVoice(first));

  russianVoice = voices[0] || null;
  return russianVoice;
}

if (synth) {
  chooseRussianVoice();
  synth.addEventListener?.("voiceschanged", chooseRussianVoice);
}

export function isSpeechSupported() {
  return Boolean(synth && "SpeechSynthesisUtterance" in window);
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(value) {
  enabled = Boolean(value && isSpeechSupported());
  if (!enabled) synth?.cancel();
  return enabled;
}

export function prepareSpeechText(text) {
  return String(text)
    .replace(/желтеть/giu, "желте́ть")
    .replace(/желтеют/giu, "желте́ют")
    .replace(/холодам/giu, "холода́м")
    .replace(/осеннего леса/giu, "осеннего ле́са");
}

export function speak(text) {
  if (!enabled || !isSpeechSupported() || !text) return false;

  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(prepareSpeechText(text));
  const selectedVoice = russianVoice || chooseRussianVoice();
  utterance.lang = "ru-RU";
  utterance.rate = 0.91;
  utterance.pitch = hasVoiceHint(selectedVoice, maleVoiceHints) ? 0.96 : 0.82;
  utterance.volume = 1;
  utterance.voice = selectedVoice;
  synth.speak(utterance);
  return true;
}

export function stopSpeaking() {
  synth?.cancel();
}
