import useAppState from '../hooks/useAppState';

export default function Body({ children }) {
  const [state] = useAppState();
  return state.isReady ? children : null;
}
