import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { globalShortcuts } from '../../utils/keyboardNavigation';
import './keyboardShortcutsHelp.scss';

const KeyboardShortcutsHelp = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show help when user presses '?' or Shift+/
    const handleKeyDown = (e) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const shortcuts = [
    { key: 'Tab', description: 'Navigate to next interactive element' },
    { key: 'Shift + Tab', description: 'Navigate to previous interactive element' },
    { key: 'Enter', description: 'Activate buttons and links' },
    { key: 'Space', description: 'Activate buttons and checkboxes' },
    { key: 'Escape', description: 'Close dialogs and modals' },
    { key: 'Alt + H', description: 'Navigate to Home page' },
    { key: 'Alt + C', description: 'Navigate to Election Calendar' },
    { key: 'Alt + P', description: 'Navigate to Profile' },
    { key: 'Alt + V', description: 'Navigate to Vote History' },
    { key: 'Alt + S', description: 'Navigate to Security Information' },
    { key: '?', description: 'Show this keyboard shortcuts help' },
    { key: 'Arrow Keys', description: 'Navigate through dropdown menus and lists' },
  ];

  return (
    <>
      {/* Keyboard hint indicator */}
      <div className="keyboard-shortcuts-help" aria-live="polite">
        Press ? for keyboard shortcuts
      </div>

      {/* Help dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="keyboard-shortcuts-title"
      >
        <DialogTitle id="keyboard-shortcuts-title">
          Keyboard Shortcuts
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            Navigate this website efficiently using your keyboard:
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {shortcuts.map((shortcut, index) => (
              <Box 
                component="li" 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: index < shortcuts.length - 1 ? '1px solid #e0e0e0' : 'none'
                }}
              >
                <Typography 
                  component="kbd" 
                  sx={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    border: '1px solid #ccc'
                  }}
                >
                  {shortcut.key}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ marginLeft: 2, flex: 1, textAlign: 'right' }}
                >
                  {shortcut.description}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              <strong>Accessibility Features:</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Click-to-Speak: Click on any marked content to hear it read aloud
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Voice Commands: Use the microphone icon to vote using your voice
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Font Size Control: Adjust text size using the navbar controls
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • High Contrast Mode: Toggle high contrast for better visibility
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KeyboardShortcutsHelp;
