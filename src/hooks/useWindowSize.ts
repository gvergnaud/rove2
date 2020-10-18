import React from 'react';

export const useWindowSize = (serverValues = [1440, 766]) => {
  const [size, setSize] = React.useState(serverValues);
  React.useEffect(() => {
    setSize([window.innerWidth, window.innerHeight]);
    const onResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
};
