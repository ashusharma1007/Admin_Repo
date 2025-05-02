import React, { useEffect } from 'react';
import { disableCopyPaste, detectScreenshot, addDynamicWatermark, disableDevTools } from '../../utils/SecurityUtils';

const SecurityProvider = ({ children, enableWatermark = false }) => {
  useEffect(() => {
    // Initialize security measures when component mounts
    disableCopyPaste();
    detectScreenshot();
    disableDevTools();
    
    if (enableWatermark) {
      addDynamicWatermark();
    }
    
    // Log security initialization
    console.log('Security measures initialized');
    
    // Optional: You can add code here to notify your backend about 
    // security initialization for audit purposes
  }, [enableWatermark]);

  return <>{children}</>;
};

export default SecurityProvider;