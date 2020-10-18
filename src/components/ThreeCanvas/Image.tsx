import React from 'react';
import { Scene } from '../ThreeRenderer';
import {
  Texture,
  Scene as ThreeScene,
  OrthographicCamera,
  PlaneBufferGeometry,
  ShaderMaterial,
  Mesh,
  TextureLoader
} from 'three';
import { mat4, float, getBestImagePosition, vec2 } from '../../utils/layouts';
import * as m4 from '../../utils/m4';
import { applyRef, removeDomain } from '../../utils/dom';
import { useOffsetRef } from '../../hooks/useOffset';
import { ScrollContext } from '../../hooks/useScroller';
import { Uniform } from '../ImaginaryCanvas/utils';
import { ObjectOf, Extend } from '../../utils/types';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useInView } from '../../hooks/useInView';

type Props = Extend<
  React.HTMLAttributes<HTMLDivElement>,
  {
    src: string;
    fragmentShader: string;
    uniforms: () => ObjectOf<Uniform>;
    zIndex?: number;
    fixed?: boolean;
    onLoad?: () => void;
  }
>;

const Image = (
  {
    src,
    className,
    fragmentShader,
    uniforms,
    zIndex,
    fixed,
    hidden,
    onLoad,
    ...props
  }: Props,
  forwaredRef
) => {
  const elRef = React.useRef<HTMLDivElement>(null);
  const startRef = React.useRef(0);
  const uniformsRef = React.useRef<ObjectOf<Uniform>>({});
  const [scene, setScene] = React.useState<ThreeScene | undefined>();
  const offsetRef = useOffsetRef(elRef);
  const textureRef = React.useRef<Texture>();
  const onScroll = React.useContext(ScrollContext);
  const [width, height] = useWindowSize();
  const [inView] = useInView(elRef);

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
    const geometry = new PlaneBufferGeometry(2, 2);

    uniformsRef.current = {
      ...uniforms(),
      iTime: float(startRef.current),
      iResolution: vec2([
        offsetRef.current.width * window.devicePixelRatio,
        offsetRef.current.height * window.devicePixelRatio
      ]),
      positionMatrix: mat4(m4.empty()),
      texture: {
        type: 't',
        value: null
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
  }, [src]);

  const onUpdatePosition = React.useCallback(image => {
    if (!image) return;

    const position = getBestImagePosition({
      imageWidth: image.width,
      imageHeight: image.height,
      containerWidth: offsetRef.current.width,
      containerHeight: offsetRef.current.height
    });

    uniformsRef.current.positionMatrix.value = m4.scaling(
      position.width / offsetRef.current.width,
      position.height / offsetRef.current.height,
      1
    );
  }, []);

  React.useEffect(() => {
    if (!textureRef.current || !textureRef?.current?.image) return;
    onUpdatePosition(textureRef.current.image);
  }, [width, height]);

  React.useEffect(() => {
    return onScroll(() => {
      const time = Date.now() - startRef.current;
      uniformsRef.current.iTime.value = time;
      uniformsRef.current.iResolution.value = [
        offsetRef.current.width * window.devicePixelRatio,
        offsetRef.current.height * window.devicePixelRatio
      ];

      Object.entries(uniforms()).forEach(([key, value]) => {
        uniformsRef.current[key] = value;
      });
    });
  }, [onScroll]);

  React.useEffect(() => {
    if (
      !inView ||
      removeDomain(src) === removeDomain(textureRef.current?.image?.src ?? '')
    )
      return;

    uniformsRef.current.texture.value = textureRef.current = new TextureLoader().load(
      src,
      text => {
        if (onLoad) onLoad();
        onUpdatePosition(text.image);
      }
    );
  }, [src, inView]);

  return (
    <Scene zIndex={zIndex} fixed={fixed} scene={scene} hidden={hidden}>
      {ref => (
        <div
          ref={applyRef(ref, elRef, forwaredRef)}
          className={className}
          {...props}
        />
      )}
    </Scene>
  );
};

export default React.forwardRef(Image);
