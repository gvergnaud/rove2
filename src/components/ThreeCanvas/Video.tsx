import React from 'react';
import { Scene } from '../ThreeRenderer';
import {
  Texture,
  Scene as ThreeScene,
  OrthographicCamera,
  PlaneBufferGeometry,
  ShaderMaterial,
  Mesh,
  VideoTexture,
  Vector2
} from 'three';
import { mat4, float, getBestImagePosition } from '../../utils/layouts';
import * as m4 from '../../utils/m4';
import { applyRef } from '../../utils/dom';
import { useVideo, VideoConfig } from '../../hooks/useVideo';
import { useOffsetRef } from '../../hooks/useOffset';
import { ScrollContext } from '../../hooks/useScroller';
import { ObjectOf, Extend } from '../../utils/types';

type Props = Extend<
  React.HTMLAttributes<HTMLDivElement>,
  {
    src: VideoConfig;
    fragmentShader: string;
    uniforms: () => ObjectOf<any>;
    track?: boolean;
    className?: string;
    zIndex?: number;
    playing?: boolean;
    onLoad?: () => void;
    maskRef?: React.RefObject<HTMLElement>;
  }
>;

// eslint-disable-next-line
const Video = React.forwardRef(
  (
    {
      maskRef,
      src,
      track,
      className,
      fragmentShader,
      uniforms,
      playing = true,
      zIndex,
      onLoad,
      ...props
    }: Props,
    forwardedRef
  ) => {
    const elRef = React.useRef();
    const uniformsRef = React.useRef(null);
    const startRef = React.useRef(0);
    const [scene, setScene] = React.useState<ThreeScene | undefined>();
    const [isReady, videoRef] = useVideo(src, playing);
    const offsetRef = useOffsetRef(elRef);
    const onScroll = React.useContext(ScrollContext);

    React.useEffect(() => {
      if (!isReady || !videoRef.current) return;
      const v = videoRef.current;
      if (playing && v.paused) v.play();
      else if (!playing && !v.paused) v.pause();
      if (onLoad) onLoad();
    }, [playing, videoRef, isReady]);

    React.useEffect(() => {
      startRef.current = Date.now();
      const scene = new ThreeScene();
      const camera = new OrthographicCamera(
        -1, // left
        1, // right
        1, // top
        -1, // bottom
        -1, // near,
        1 // far
      );
      scene.userData.camera = camera;
      scene.userData.track = track;

      const geometry = new PlaneBufferGeometry(2, 2);

      uniformsRef.current = {
        ...uniforms(),
        iTime: float(startRef.current),
        iResolution: {
          type: 'vec2',
          value: new Vector2(
            offsetRef.current.width * window.devicePixelRatio,
            offsetRef.current.height * window.devicePixelRatio
          )
        },
        positionMatrix: mat4(m4.empty()),
        texture: {
          type: 't',
          value: new Texture()
        }
      };

      const material = new ShaderMaterial({
        transparent: true,
        uniforms: uniformsRef.current,
        fragmentShader,
        vertexShader: `
          varying mediump vec2 vUv;
          uniform mat4 positionMatrix;

          void main() {
            vUv = uv;

            vec4 modelViewPosition = positionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
          }
        `
      });

      scene.add(new Mesh(geometry, material));

      setScene(scene);
    }, []);

    React.useEffect(() => {
      return onScroll(() => {
        const time = Date.now() - startRef.current;
        uniformsRef.current.iTime.value = time;
        uniformsRef.current.iResolution.value.set(
          offsetRef.current.width * window.devicePixelRatio,
          offsetRef.current.height * window.devicePixelRatio
        );

        Object.entries(uniforms()).forEach(([key, value]) => {
          uniformsRef.current[key] = value;
        });
      });
    }, [offsetRef, onScroll]);

    React.useEffect(() => {
      if (!isReady || !videoRef.current || !uniformsRef.current) return;
      uniformsRef.current.texture = {
        type: 't',
        value: new VideoTexture(videoRef.current)
      };

      const position = getBestImagePosition({
        imageWidth: videoRef.current.videoWidth,
        imageHeight: videoRef.current.videoHeight,
        containerWidth: offsetRef.current.width,
        containerHeight: offsetRef.current.height
      });

      uniformsRef.current.positionMatrix.value = m4.scaling(
        position.width / offsetRef.current.width,
        position.height / offsetRef.current.height,
        1
      );
    }, [isReady, videoRef, uniformsRef, offsetRef]);

    return (
      <Scene zIndex={zIndex} scene={scene} maskRef={maskRef}>
        {ref => (
          <div
            ref={applyRef(ref, forwardedRef, elRef)}
            className={className}
            {...props}
          />
        )}
      </Scene>
    );
  }
);

export default Video;
