// Keyboard navigation utilities for accessibility

// Focus trap for modals/dialogs
export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

// Enable Escape key to close modals/dialogs
export function enableEscapeKey(onEscape) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onEscape();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

// Focus management - save and restore focus
export class FocusManager {
  constructor() {
    this.previousFocus = null;
  }

  saveFocus() {
    this.previousFocus = document.activeElement;
  }

  restoreFocus() {
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }
  }

  setFocus(element) {
    if (element && element.focus) {
      element.focus();
    }
  }
}

// Keyboard shortcuts manager
export class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = true;
  }

  register(key, callback, description = '', ctrl = false, alt = false, shift = false) {
    const shortcutKey = `${ctrl ? 'Ctrl+' : ''}${alt ? 'Alt+' : ''}${shift ? 'Shift+' : ''}${key}`;
    this.shortcuts.set(shortcutKey, { callback, description, ctrl, alt, shift, key });
  }

  unregister(key) {
    this.shortcuts.delete(key);
  }

  handleKeyDown(e) {
    if (!this.enabled) return;

    const shortcutKey = `${e.ctrlKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`;
    const shortcut = this.shortcuts.get(shortcutKey);

    if (shortcut) {
      e.preventDefault();
      shortcut.callback(e);
    }
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  getShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([key, value]) => ({
      key,
      description: value.description
    }));
  }
}

// Initialize keyboard shortcuts globally
export const globalShortcuts = new KeyboardShortcuts();

// Add global keyboard listener
if (typeof window !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    globalShortcuts.handleKeyDown(e);
  });
}

// Skip to content functionality
export function initSkipLinks() {
  const skipLink = document.querySelector('.skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.querySelector('main, [role="main"], #main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        mainContent.addEventListener('blur', () => {
          mainContent.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  }
}

// Make cards keyboard accessible
export function makeCardsAccessible() {
  const cards = document.querySelectorAll('.MuiCard-root, .ant-card');
  
  cards.forEach(card => {
    // If card has a link or button, make the whole card clickable
    const link = card.querySelector('a');
    const button = card.querySelector('button');
    
    if (link || button) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (link) {
            link.click();
          } else if (button) {
            button.click();
          }
        }
      });
    }
  });
}

// Focus visible styles - show focus outline only for keyboard navigation
export function initFocusVisible() {
  let isUsingKeyboard = false;

  document.addEventListener('mousedown', () => {
    isUsingKeyboard = false;
    document.body.classList.remove('keyboard-nav');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isUsingKeyboard = true;
      document.body.classList.add('keyboard-nav');
    }
  });
}

// Announce to screen readers
export function announce(message, priority = 'polite') {
  const announcer = document.getElementById('aria-live-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;
  
  // Clear after announcement
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'aria-live-announcer';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  document.body.appendChild(announcer);
  return announcer;
}
