import React from 'react';
import isMobile from 'ismobilejs';

export const IsMobileContext = React.createContext(isMobile());

export default function useIsMobile() {
  return React.useContext(IsMobileContext);
}
