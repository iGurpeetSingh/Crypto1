const MESSAGE = 'क्रिप्टो डैश में आपका स्वागत है। बधाई हो! आपका डेमो ट्रेडिंग अकाउंट तैयार है। यह प्लेटफॉर्म केवल सीखने और अभ्यास के लिए बनाया गया है। यहाँ आप वर्चुअल पैसों से मार्केट देख सकते हैं और डेमो ट्रेड लगा सकते हैं। इसमें कोई असली पैसा निवेश नहीं होता और कोई वास्तविक ट्रेड नहीं की जाती। आपकी डेमो ट्रेडिंग यात्रा के लिए शुभकामनाएँ।';

// Hindi voice selection: prefer known feminine Hindi voices when the browser
// exposes one. The browser/OS voice catalogue determines which voices exist.
const FEMALE_VOICE = /kalpana|swara|aditi|heera|priya|kavya|female|woman|google.*hindi.*(female|woman)/i;
const HINDI_VOICE = /^(hi|hi-in)([-_]|$)/i;

function chooseHindiFemaleVoice(voices) {
  const hindiVoices = voices.filter(voice => HINDI_VOICE.test(voice.lang));
  return hindiVoices.find(voice => FEMALE_VOICE.test(voice.name))
    || hindiVoices.find(voice => /google/i.test(voice.name))
    || hindiVoices[0]
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
      const hindiVoice = chooseHindiFemaleVoice(voices);

      utterance.lang = hindiVoice?.lang || 'hi-IN';
      if (hindiVoice) utterance.voice = hindiVoice;
      // A higher pitch is a fallback only; a genuinely feminine voice must
      // be installed/enabled in the browser or operating system.
      utterance.rate = 0.88;
      utterance.pitch = 1.32;
      utterance.volume = 1;
      utterance.onerror = event => console.warn('CryptoDash Hindi welcome speech error:', event.error);
      synth.speak(utterance);
    };

    if (synth.getVoices().length) {
      speak();
    } else {
      const onVoicesChanged = () => {
        synth.removeEventListener?.('voiceschanged', onVoicesChanged);
        speak();
      };
      synth.addEventListener?.('voiceschanged', onVoicesChanged, { once: true });
      window.setTimeout(() => {
        synth.removeEventListener?.('voiceschanged', onVoicesChanged);
        if (!synth.speaking && !synth.pending) speak();
      }, 1200);
    }
    return true;
  } catch (error) {
    console.error('CryptoDash Hindi welcome voice failed:', error);
    return false;
  }
}
