const MESSAGE = 'Welcome to CryptoDash. Congratulations, your demo trading account is ready. CryptoDash is a virtual demo trading platform created for learning and practice. You can explore the markets and place simulated trades using virtual funds. No real money is invested and no real trades are executed. Enjoy your demo trading experience.';

export function playWelcomeVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    window?.alert?.('Welcome voice is not supported by this browser. Please use the latest Chrome browser.');
    return false;
  }
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(MESSAGE);
    const voices = synth.getVoices();
    const preferred = voices.find(v => /zira|samantha|aria|jenny|sara|heera|priya|kavya|female/i.test(v.name))
      || voices.find(v => /^en-IN/i.test(v.lang))
      || voices.find(v => /^en/i.test(v.lang));
    if (preferred) utterance.voice = preferred;
    utterance.lang = preferred?.lang || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.15;
    utterance.volume = 1;
    utterance.onerror = event => console.warn('CryptoDash welcome speech error:', event.error);
    synth.speak(utterance);
    return true;
  } catch (error) {
    console.error('CryptoDash welcome voice failed:', error);
    return false;
  }
}
