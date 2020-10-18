import React from 'react';
import { isSlowNetwork } from '../utils/connection';

export const IsSlowNetworkContext = React.createContext(isSlowNetwork());

export default function useIsSlowNetwork() {
  return React.useContext(IsSlowNetworkContext);
}
