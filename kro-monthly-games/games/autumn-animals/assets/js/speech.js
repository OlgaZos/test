const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
let enabled = false;
let russianVoice = null;

function chooseRussianVoice() {
  if (!synth) return null;
  const voices = synth.getVoices();
  russianVoice =
    voices.find((voice) => voice.lang.toLowerCase() === "ru-ru") ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("ru")) ||
    null;
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

export function speak(text) {
  if (!enabled || !isSpeechSupported() || !text) return false;

  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ru-RU";
  utterance.rate = 0.91;
  utterance.pitch = 1.04;
  utterance.volume = 1;
  utterance.voice = russianVoice || chooseRussianVoice();
  synth.speak(utterance);
  return true;
}

export function stopSpeaking() {
  synth?.cancel();
}
