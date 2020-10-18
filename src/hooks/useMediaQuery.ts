import React from 'react';

export default function useMediaQuery(mq: string) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    setMatches(matchMedia(mq).matches);
  }, []);
  return matches;
}
