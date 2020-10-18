import React from 'react';

export const usePromise = (getPromise, defaultValue, deps) => {
  const [value, setValue] = React.useState(defaultValue);
  React.useEffect(() => {
    getPromise().then(setValue);
  }, deps);
  return value;
};
