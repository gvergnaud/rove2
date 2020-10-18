import React from 'react';
import { State, initialState } from '../state';

const StateContext = React.createContext<{
  state: State;
  dispatch: (action: any) => void;
}>({ state: initialState, dispatch: () => {} });

export default StateContext;
