import { Route } from './copy';

type Action<T, U> = {
  readonly type: T;
  readonly payload?: U;
};

const createAction = <T extends string, U>(
  type: T,
  payload?: U
): Action<T, U> => ({ type, payload });

type ActionCreators = {
  [k: string]: (...args: unknown[]) => Action<unknown, unknown>;
};

type ExtractActions<A extends ActionCreators> = ReturnType<A[keyof A]>;

export type Theme = 'light' | 'dark';

export type State = {
  isInterfaceHidden: boolean;
  theme: Theme;
  route: Route;
  isReady: boolean;
};

export const initialState: State = {
  isInterfaceHidden: true,
  theme: 'light',
  route: { name: 'home', params: {} },
  isReady: false
};

export const reducer = (
  state: State,
  action: ExtractActions<typeof actions>
): State => {
  switch (action.type) {
    case 'hideInterface':
      return { ...state, isInterfaceHidden: true };
    case 'showInterface':
      return { ...state, isInterfaceHidden: false };
    case 'setTheme':
      return { ...state, theme: action.payload };
    case 'updateRoute':
      return { ...state, route: action.payload };
    case 'setReady':
      return { ...state, isReady: true };
    default:
      return state;
  }
};

export const actions = {
  hideInterface: () => createAction('hideInterface'),
  showInterface: () => createAction('showInterface'),
  setTheme: (theme: Theme) => createAction('setTheme', theme),
  updateRoute: (route: Route) => createAction('updateRoute', route),
  setReady: () => createAction('setReady')
};
