const MESSAGE = 'Welcome to CryptoDash. Congratulations, your demo trading account is ready. CryptoDash is a virtual demo trading platform created for learning and practice. You can explore the markets and place simulated trades using virtual funds. No real money is invested and no real trades are executed. Enjoy your demo trading experience.';

// Browser voice lists can load after the page starts. Prefer explicitly feminine
// voices; do not select the first English voice because it is often masculine.
const FEMALE_VOICE = /zira|samantha|aria|jenny|sara|heera|priya|kavya|female|woman|google us english|google uk english| microsoft.*(jenny|aria|zira)/i;
const ENGLISH_VOICE = /^en(-|_)/i;

function chooseFemaleVoice(voices) {
  const feminine = voices.filter(voice => FEMALE_VOICE.test(voice.name));
  return feminine.find(voice => /^en[-_]IN/i.test(voice.lang))
    || feminine.find(voice => ENGLISH_VOICE.test(voice.lang))
    || feminine[0]
    || null;
}

export function playWelcomeVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    return false;
  }

  const synth = window.speechSynthesis;
  try {
    synth.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(MESSAGE);
      const voices = synth.getVoices();
      const femaleVoice = chooseFemaleVoice(voices);

      if (femaleVoice) {
        utterance.voice = femaleVoice;
        utterance.lang = femaleVoice.lang || 'en-IN';
      } else {
        // Browser/OS exposes no identifiable feminine voice. Use a higher,
        // softer English voice profile as the best available fallback.
        const englishVoice = voices.find(voice => ENGLISH_VOICE.test(voice.lang));
        if (englishVoice) {
          utterance.voice = englishVoice;
          utterance.lang = englishVoice.lang;
        } else {
          utterance.lang = 'en-IN';
        }
      }

      utterance.rate = 0.92;
      utterance.pitch = femaleVoice ? 1.18 : 1.38;
      utterance.volume = 1;
      utterance.onerror = event => console.warn('CryptoDash welcome speech error:', event.error);
      synth.speak(utterance);
    };

    const availableVoices = synth.getVoices();
    if (availableVoices.length) {
      speak();
    } else {
      // Some Chromium browsers populate voices asynchronously.
      const onVoicesChanged = () => {
        synth.removeEventListener?.('voiceschanged', onVoicesChanged);
        speak();
      };
      synth.addEventListener?.('voiceschanged', onVoicesChanged, { once: true });
      window.setTimeout(() => {
        synth.removeEventListener?.('voiceschanged', onVoicesChanged);
        if (!synth.speaking && !synth.pending) speak();
      }, 1000);
    }
    return true;
  } catch (error) {
    console.error('CryptoDash welcome voice failed:', error);
    return false;
  }
}
