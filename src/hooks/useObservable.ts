import React from 'react';
import { Observable } from 'rxjs';

export function useObservable<T>(obs: Observable<T>, defaultValue: T): T {
  const [value, setValue] = React.useState(defaultValue);
  React.useEffect(() => {
    const sub = obs.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [obs]);
  return value;
}

export function useObservableRef(obs, defaultValue) {
  const valueRef = React.useRef(defaultValue);
  React.useEffect(() => {
    const sub = obs.subscribe(x => (valueRef.current = x));
    return () => sub.unsubscribe();
  }, [obs]);
  return valueRef;
}
