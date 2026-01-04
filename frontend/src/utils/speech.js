// Click-to-speak utility using the Web Speech API
const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
let bound = false;
let observer;

function speak(text) {
  if (!hasSpeech) return;
  const trimmed = (text || '').replace(/\s+/g, ' ').trim();
  if (!trimmed) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function getLabelText(el) {
  if (!el) return '';
  const ariaLabel = el.getAttribute?.('aria-label');
  if (ariaLabel) return ariaLabel;

  const labelledBy = el.getAttribute?.('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy.split(' ');
    const parts = ids.map((id) => {
      const node = document.getElementById(id);
      return node?.textContent || '';
    });
    const joined = parts.join(' ').trim();
    if (joined) return joined;
  }

  const altText = el.getAttribute?.('alt');
  if (altText) return altText;

  const title = el.getAttribute?.('title');
  if (title) return title;

  // Try associated label for inputs
  if (el.id) {
    const label = document.querySelector(`label[for="${el.id}"]`);
    if (label?.textContent) return label.textContent;
  }

  if (el.textContent) return el.textContent;
  return '';
}

function setAriaIfMissing(el) {
  if (!el || el.getAttribute?.('aria-label')) return;
  const text = getLabelText(el);
  const placeholder = el.getAttribute?.('placeholder');
  const label = (placeholder || text || '').replace(/\s+/g, ' ').trim();
  if (label) el.setAttribute('aria-label', label);
}

function labelInteractiveElements(root = document) {
  const selectors = [
    'button',
    '[role="button"]',
    'a',
    '[role="link"]',
    'input',
    'select',
    'textarea',
    '[role="article"]',
    '[role="region"]',
    '.ant-card',
    '.MuiCard-root',
    '.card'
  ];

  root.querySelectorAll(selectors.join(',')).forEach(setAriaIfMissing);
}

export function initClickToSpeak() {
  if (!hasSpeech || bound) return;
  bound = true;

  // Initial labeling for speech
  labelInteractiveElements();

  // Re-label on DOM changes
  if ('MutationObserver' in window) {
    observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            labelInteractiveElements(node);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  const handler = (event) => {
    const target = event.target.closest('[data-speak]') || event.target.closest('[aria-label]') || event.target;
    if (!target) return;

    // Prefer explicit data-speak when present
    const explicit = target.getAttribute?.('data-speak');
    const text = explicit || getLabelText(target);
    speak(text);
  };

  document.addEventListener('click', handler, true);
}

// Speech Recognition for voice commands
const hasSpeechRecognition = typeof window !== 'undefined' && 
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

let recognition = null;

export function initSpeechRecognition() {
  if (!hasSpeechRecognition) return null;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  return recognition;
}

export function startListening(onResult, onError) {
  if (!recognition) {
    recognition = initSpeechRecognition();
  }
  
  if (!recognition) {
    onError?.('Speech recognition is not supported in this browser');
    return;
  }

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult?.(transcript);
  };

  recognition.onerror = (event) => {
    onError?.(event.error);
  };

  recognition.start();
}

export function stopListening() {
  if (recognition) {
    recognition.stop();
  }
}

// Enhanced speak with callback
export function speakWithCallback(text, onEnd) {
  if (!hasSpeech) {
    onEnd?.();
    return;
  }
  
  const trimmed = (text || '').replace(/\s+/g, ' ').trim();
  if (!trimmed) {
    onEnd?.();
    return;
  }
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export { speak };
