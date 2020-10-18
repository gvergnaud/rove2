import React from 'react';
import StateContext from '../contexts/state';
import { actions, State } from '../state';

type BoundCations = {
  [K in keyof typeof actions]: (...args: Parameters<typeof actions[K]>) => void;
};

const useAppState = (): [State, BoundCations] => {
  const { state, dispatch } = React.useContext(StateContext);

  const boundActions = React.useMemo(
    (): BoundCations =>
      Object.keys(actions).reduce<BoundCations>(
        (acc, k) => ({
          // @ts-ignore
          ...acc,
          [k]: (...args) => dispatch(actions[k](...args))
        }),
        {} as BoundCations
      ),
    [dispatch]
  );

  return [state, boundActions];
};

export default useAppState;
