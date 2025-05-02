export const disableDevTools = () => {
  // Method 1: Detect DevTools opening
  let devToolsTimeout;
  const disableDevTools = () => {
    if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
      // Likely dev tools detected
      document.body.innerHTML = 'Developer tools detected. This action has been logged.';
      return true;
    }
    return false;
  };

  // Method 2: Add listener for key events that open DevTools
  window.addEventListener('keydown', e => {
    // Detect F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (
      e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))
    ) {
      e.preventDefault();
      return false;
    }
  });

  // Method 3: Continuous monitoring
  window.addEventListener('resize', () => {
    clearTimeout(devToolsTimeout);
    devToolsTimeout = setTimeout(() => {
      disableDevTools();
    }, 500);
  });

  // Monitor DevTools status
  setInterval(() => {
    disableDevTools();
  }, 1000);
};

export const disableCopyPaste = () => {
  // Disable right click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable cut, copy, paste shortcuts
  document.addEventListener('keydown', (e) => {
    // Check if ctrl or meta (command) key is pressed
    if ((e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 'x' || e.key === 'v' || 
         e.key === 'a' || e.key === 's' || e.key === 'p' || 
         e.key === 'j' || e.keyCode === 44 /* Print Screen */)) {
      e.preventDefault();
      return false;
    }
  });

  // Disable text selection
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* Allow selection in form inputs and textareas */
    input, textarea {
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
  `;
  document.head.appendChild(style);

  // Disable drag and drop
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Alert when print is attempted
  window.addEventListener('beforeprint', (e) => {
    e.preventDefault();
    alert('Printing is disabled for security reasons.');
    return false;
  });
};

// Detects screenshot attempts (not 100% reliable but adds a layer)
export const detectScreenshot = () => {
  let lastVisibilityState = document.visibilityState;
  
  document.addEventListener('visibilitychange', () => {
    // On Mac, taking a screenshot momentarily changes the visibility state
    if (lastVisibilityState === 'visible' && document.visibilityState === 'hidden') {
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          // This quick hidden -> visible transition is often indicative of screenshot
          console.log('Possible screenshot detected');
          // You can add a custom notification or watermark here
          showScreenshotWarning();
        }
      }, 50);
    }
    lastVisibilityState = document.visibilityState;
  });
};

// Show a warning when screenshot is detected
const showScreenshotWarning = () => {
  const warningEl = document.createElement('div');
  warningEl.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 9999;
    text-align: center;
    font-weight: bold;
  `;
  warningEl.textContent = 'Screenshot detected! This action has been logged.';
  document.body.appendChild(warningEl);
  
  setTimeout(() => {
    document.body.removeChild(warningEl);
  }, 3000);
};

// Add dynamic watermark to make screenshots less useful
export const addDynamicWatermark = () => {
  const watermark = document.createElement('div');
  const userId = 'User-' + Math.floor(Math.random() * 1000000);
  const timestamp = new Date().toISOString();
  
  watermark.textContent = `CONFIDENTIAL - ${userId} - ${timestamp}`;
  watermark.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(128, 128, 128, 0.2);
    font-size: 2rem;
    font-weight: bold;
    z-index: 2000;
    transform: rotate(-45deg);
    pointer-events: none;
  `;
  
  document.body.appendChild(watermark);
};