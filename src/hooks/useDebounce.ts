import debounce from 'lodash/debounce';
import React from 'react';

export default function useDebounce<T extends unknown[]>(
  f: (...args: T) => void,
  ms: number,
  deps: any[] = []
) {
  const debounced = React.useMemo(() => debounce(f, ms), deps);

  React.useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
}
