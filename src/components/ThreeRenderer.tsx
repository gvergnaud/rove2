import React from 'react';
import { css } from 'emotion';
import { useInViewRef } from '../hooks/useInView';
import { ScrollContext } from '../hooks/useScroller';
import { WebGLRenderer } from 'three';

export const Context = React.createContext({
  addScene: (_scene: THREE.Scene) => {},
  removeScene: (_scene: THREE.Scene) => {}
});

type SceneProps = {
  scene: THREE.Scene;
  children: (elRef: React.RefObject<HTMLElement>) => JSX.Element;
  zIndex?: number;
  fixed?: boolean;
  hidden?: boolean;
  maskRef?: React.RefObject<HTMLElement>;
};

export const Scene = React.memo(
  ({ zIndex = 0, fixed, scene, children, hidden, maskRef }: SceneProps) => {
    const elRef = React.useRef(null);
    const [inViewRef] = useInViewRef(elRef);
    const { addScene, removeScene } = React.useContext(Context);

    React.useEffect(() => {
      if (!scene) return;
      if (!elRef.current) return;
      scene.userData.element = elRef.current;
      scene.userData.maskElement = maskRef?.current;
      scene.userData.zIndex = zIndex;

      // check if it's offscreen. If so skip it
      scene.userData.shouldRender = () =>
        !hidden && (fixed || inViewRef.current);

      addScene(scene);
      return () => {
        removeScene(scene);
      };
    }, [zIndex, scene, addScene, removeScene, inViewRef, fixed]);

    return children(elRef);
  }
);

const useRenderer = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const scenesRef = React.useRef([]);
  const rendererRef = React.useRef<THREE.WebGLRenderer>();
  const onScroll = React.useContext(ScrollContext);

  const addScene = React.useCallback(scene => {
    if (scene) {
      scenesRef.current.push(scene);
      scenesRef.current.sort((a, b) => a.userData.zIndex - b.userData.zIndex);
    }
  }, []);
  const removeScene = React.useCallback(scene => {
    scenesRef.current = scenesRef.current.filter(s => s !== scene);
  }, []);

  React.useEffect(() => {
    const updateSize = () => {
      var width = canvasRef.current.clientWidth;
      var height = canvasRef.current.clientHeight;
      if (
        canvasRef.current.width !== width ||
        canvasRef.current.height !== height
      ) {
        rendererRef.current.setSize(width, height, false);
      }
    };

    const render = () => {
      updateSize();
      rendererRef.current.setClearColor(0x000000, 0);
      rendererRef.current.setScissorTest(true);

      for (const scene of scenesRef.current) {
        // get the element that is a place holder for where we want to
        // draw the scene
        if (!scene.userData.shouldRender()) {
          continue; // it's off screen
        }

        const getRect = el => {
          const rect = el.getBoundingClientRect();

          // set the viewport
          const width = rect.right - rect.left;
          const height = rect.bottom - rect.top;
          const left = rect.left;
          const bottom =
            rendererRef.current.domElement.clientHeight - rect.bottom;

          return { width, height, left, bottom };
        };

        const { left, bottom, width, height } = getRect(scene.userData.element);

        rendererRef.current.setViewport(left, bottom, width, height);

        if (scene.userData.maskElement) {
          const { left, bottom, width, height } = getRect(
            scene.userData.maskElement
          );
          rendererRef.current.setScissor(left, bottom, width, height);
        } else {
          rendererRef.current.setScissor(left, bottom, width, height);
        }

        const camera = scene.userData.camera;

        rendererRef.current.render(scene, camera);
      }
    };

    rendererRef.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    rendererRef.current.autoClear = false;
    rendererRef.current.setPixelRatio(window.devicePixelRatio);

    return onScroll(render, 5);
  }, []);

  return [addScene, removeScene];
};

export default function ThreeRenderer({ children }) {
  const canvasRef = React.useRef();
  const [addScene, removeScene] = useRenderer(canvasRef);

  return (
    <Context.Provider value={{ addScene, removeScene }}>
      <canvas
        ref={canvasRef}
        className={css`
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          position: fixed;
          pointer-events: none;
        `}
      />
      {children}
    </Context.Provider>
  );
}
