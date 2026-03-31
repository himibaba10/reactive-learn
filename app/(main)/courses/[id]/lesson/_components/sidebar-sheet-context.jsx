'use client';

import { createContext, useContext } from 'react';

const SidebarSheetContext = createContext(null);

export const useSidebarSheet = () => useContext(SidebarSheetContext);

export const SidebarSheetProvider = ({ children, onClose }) => {
  return (
    <SidebarSheetContext.Provider value={{ close: onClose }}>
      {children}
    </SidebarSheetContext.Provider>
  );
};
