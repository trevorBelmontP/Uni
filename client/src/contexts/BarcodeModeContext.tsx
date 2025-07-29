/**
 * BarcodeModeContext
 * 
 * Purpose: Provides global state management for barcode mode toggle
 * - Allows switching between camera scanning and input box modes
 * - Shared across all components that need to know the current mode
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BarcodeModeContextType {
  isBarcodeMode: boolean;
  setIsBarcodeMode: (mode: boolean) => void;
}

const BarcodeModeContext = createContext<BarcodeModeContextType | undefined>(undefined);

export const BarcodeModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBarcodeMode, setIsBarcodeMode] = useState(true);

  return (
    <BarcodeModeContext.Provider value={{ isBarcodeMode, setIsBarcodeMode }}>
      {children}
    </BarcodeModeContext.Provider>
  );
};

export const useBarcodeMode = () => {
  const context = useContext(BarcodeModeContext);
  if (context === undefined) {
    throw new Error('useBarcodeMode must be used within a BarcodeModeProvider');
  }
  return context;
};