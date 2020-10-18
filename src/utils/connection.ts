export const isSlowNetwork = () => {
  // @ts-ignore
  if (!process.browser) return false;
  const connection =
    // @ts-ignore
    navigator.connection ||
    // @ts-ignore
    navigator.mozConnection ||
    // @ts-ignore
    navigator.webkitConnection;

  return !connection ? false : connection.downlink < 1;
};
