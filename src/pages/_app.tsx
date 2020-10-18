import React from 'react';
import App from 'next/app';
import Page from '../components/Page';
import { useRouter } from 'next/router';
import isMobile from 'ismobilejs';
import { delay } from '../utils/promises';

const parseQueryParams = (search: string) =>
  search
    .replace('?', '')
    .split('&')
    .map(s => s.split('='))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

const useInitialScrollY = () => {
  const router = useRouter();
  const [initialScrollY, setInitialScrollY] = React.useState(0);
  React.useEffect(() => {
    const handler = () => {
      if (window.location.pathname !== '/') setInitialScrollY(0);

      if (window.location.search) {
        const params: { project?: string } = parseQueryParams(
          window.location.search
        );

        if (!params.project) return;

        const anchor = params.project;
        const el = document.querySelector(`[data-anchor="${anchor}"]`);
        if (!el) return setInitialScrollY(0);
        const { top } = el.getBoundingClientRect();
        setInitialScrollY(top - 100);
      }
    };
    router.events.on('routeChangeComplete', handler);
    return () => router.events.off('routeChangeComplete', handler);
  }, [router]);
  return initialScrollY;
};

const WithInitialScrollY = ({ children }) => {
  return children(useInitialScrollY());
};

const WithRouter = ({ children }) => {
  return children(useRouter());
};

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <WithRouter>
        {router => (
          <WithInitialScrollY>
            {initialScrollY => (
              <Page
                isMobile={isMobile()}
                initialScrollY={initialScrollY}
                pageId={router.asPath}
              >
                <Component {...pageProps} />
              </Page>
            )}
          </WithInitialScrollY>
        )}
      </WithRouter>
    );
  }
}
