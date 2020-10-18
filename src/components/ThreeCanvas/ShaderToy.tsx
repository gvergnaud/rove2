import React from 'react';
import { Scene } from '../ThreeRenderer';
import {
  Scene as ThreeScene,
  OrthographicCamera,
  PlaneBufferGeometry,
  ShaderMaterial,
  Mesh,
  Vector2
} from 'three';
import { mat4, float } from '../../utils/layouts';
import * as m4 from '../../utils/m4';
import { applyRef } from '../../utils/dom';
import { ScrollContext } from '../../hooks/useScroller';
import { useOffsetRef } from '../../hooks/useOffset';
import { ObjectOf, Extend } from '../../utils/types';
import { Uniform } from '../ImaginaryCanvas/utils';

type Props = Extend<
  React.HTMLAttributes<HTMLDivElement>,
  {
    fragmentShader: string;
    uniforms: () => ObjectOf<Uniform>;
    fixed?: boolean;
    zIndex?: number;
  }
>;

const ShaderToy = ({
  className,
  fragmentShader,
  uniforms,
  fixed,
  zIndex,
  ...props
}: Props) => {
  const elRef = React.useRef(null);
  const onScroll = React.useContext(ScrollContext);
  const uniformsRef = React.useRef<ObjectOf<any>>({});
  const [scene, setScene] = React.useState();
  const offsetRef = useOffsetRef(elRef);

  React.useEffect(() => {
    const start = Date.now();
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
      iTime: float(start),
      iDevicePixelRatio: float(window.devicePixelRatio),
      iResolution: {
        type: 'vec2',
        value: new Vector2(
          offsetRef.current.width * window.devicePixelRatio,
          offsetRef.current.height * window.devicePixelRatio
        )
      }
    };

    const material = new ShaderMaterial({
      transparent: true,
      uniforms: uniformsRef.current,
      fragmentShader,
      vertexShader: `
        varying mediump vec2 vUv;

        void main() {
          vUv = uv;

          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewPosition;
        }
      `
    });

    scene.add(new Mesh(geometry, material));

    setScene(scene);
  }, []);

  React.useEffect(() => {
    const start = Date.now();
    return onScroll(() => {
      const time = Date.now() - start;
      uniformsRef.current.iTime.value = time;
      uniformsRef.current.iResolution.value.set(
        offsetRef.current.width * window.devicePixelRatio,
        offsetRef.current.height * window.devicePixelRatio
      );

      Object.entries(uniforms()).forEach(([key, value]) => {
        uniformsRef.current[key] = value;
      });
    });
  }, [offsetRef, onScroll, uniforms]);

  return (
    <Scene zIndex={zIndex} fixed={fixed} scene={scene}>
      {ref => (
        <div ref={applyRef(ref, elRef)} className={className} {...props} />
      )}
    </Scene>
  );
};

export default ShaderToy;
