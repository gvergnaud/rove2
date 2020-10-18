import Router from 'next/router';
import Head from 'next/head';
import React from 'react';
import { css } from 'emotion';
import useMediaQuery from '../hooks/useMediaQuery';
import Background, { Animation } from './Background';
import Scrollable from './Scrollable';
import ThreeRenderer from './ThreeRenderer';
import ShaderImagesContext from '../contexts/shaderImages';
import StateContext from '../contexts/state';
import { reducer, initialState, actions } from '../state';
import FloatingLogo from '../components/FloatingLogo';
import Nav from '../components/Nav';
import { scrollTo } from '../hooks/useScroller';
import usePageTransition from '../hooks/usePageTransition';
import { blackRgba, mqSmall } from '../style/variables';
import { IsMobileContext } from '../hooks/useIsMobile';
import Loader from './Loader';
import { isMobileResult } from 'ismobilejs/types';
import { isSlowNetwork } from '../utils/connection';
import { IsSlowNetworkContext } from '../hooks/useIsSlowNetwork';
import { getRouteName } from '../routes';
import MobileMenu from './MobileMenu';
import { opacitySpringConfig } from '../utils/animations';

const homeRoutes = [
  { name: 'showreel', onClick: () => scrollTo('#showreel') },
  { name: 'films', onClick: () => scrollTo('#films') },
  { name: 'about', onClick: () => scrollTo('#about') },
  { name: 'services', onClick: () => scrollTo('#services') },
  { name: 'contact', onClick: () => scrollTo('#contact') }
];

const CaseStudyBackNav = ({ project }) => {
  const onPageTransition = usePageTransition();
  const backLink = {
    name: 'back',
    onClick: e => {
      e.preventDefault();
      onPageTransition({
        color: blackRgba,
        href: '/',
        as: `/?project=${project}`,
        theme: 'dark',
        type: Animation.Backward
      });
    }
  };

  return <Nav links={[backLink]} mobileLinks={[backLink]} />;
};

export const PageIdContext = React.createContext('/');

type Props = {
  initialScrollY: number;
  children: React.ReactNode;
  pageId: string;
  isMobile: isMobileResult;
};

const Page = ({ initialScrollY, children, pageId, isMobile }: Props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const preferReducedMotion = useMediaQuery(
    'screen and (prefers-reduced-motion: reduce)'
  );

  React.useEffect(() => {
    const handler = () => {
      const name = getRouteName(Router.route);
      // @ts-ignore
      if (name) dispatch(actions.updateRoute({ name, params: Router.query }));
    };
    handler();
    Router.events.on('routeChangeComplete', handler);
    return () => Router.events.off('routeChangeComplete', handler);
  }, []);

  const [slowNetwork, setSlowNetwork] = React.useState(isSlowNetwork());

  React.useEffect(() => {
    const connection =
      // @ts-ignore
      window.navigator.connection ||
      // @ts-ignore
      window.navigator.mozConnection ||
      // @ts-ignore
      window.navigator.webkitConnection;

    if (!connection) return;

    const handler = () => {
      setSlowNetwork(isSlowNetwork());
    };

    connection.addEventListener('change', handler);
    return () => connection.removeEventListener('change', handler);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const onToggleMobileMenu = () => setIsMobileMenuOpen(x => !x);

  return (
    <>
      <Head>
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-157286254-1"
        ></script>
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-157286254-1');
          `
          }}
        />
      </Head>
      <StateContext.Provider value={{ state, dispatch }}>
        <IsMobileContext.Provider value={isMobile}>
          <IsSlowNetworkContext.Provider value={slowNetwork}>
            <PageIdContext.Provider value={pageId}>
              <ShaderImagesContext.Provider value={!preferReducedMotion}>
                {state.isReady ? null : <Loader />}
                {state.route.name === 'home' ? (
                  <>
                    <Nav
                      links={homeRoutes}
                      mobileLinks={[
                        { name: 'menu', onClick: () => onToggleMobileMenu() }
                      ]}
                    />
                    <MobileMenu
                      homeRoutes={homeRoutes}
                      isOpen={isMobileMenuOpen}
                      onToggle={onToggleMobileMenu}
                    />
                  </>
                ) : state.route.name === 'casestudy' ? (
                  <CaseStudyBackNav project={state.route.params.name} />
                ) : null}
                <Scrollable initialScrollY={initialScrollY} pageId={pageId}>
                  {ref => (
                    <ThreeRenderer>
                      <FloatingLogo
                        className={css`
                          display: block;
                          ${mqSmall(css`
                            display: none;
                          `)}
                        `}
                      />
                      <Background
                        className={css`
                          width: 100vw;
                          height: 100vh;
                          position: fixed;
                        `}
                      />
                      <div
                        id="scrollable"
                        className={css`
                          will-change: transform, opacity;
                          transition: opacity ${opacitySpringConfig.duration}s
                            ease;
                          opacity: ${state.isInterfaceHidden ? '0' : '1'};
                        `}
                        ref={ref}
                      >
                        <FloatingLogo
                          className={css`
                            display: none;
                            ${mqSmall(css`
                              display: block;
                            `)}
                          `}
                        />
                        {children}
                      </div>
                    </ThreeRenderer>
                  )}
                </Scrollable>
              </ShaderImagesContext.Provider>
            </PageIdContext.Provider>
          </IsSlowNetworkContext.Provider>
        </IsMobileContext.Provider>
      </StateContext.Provider>
    </>
  );
};

export default Page;
