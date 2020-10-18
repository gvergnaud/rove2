import isEqual from 'lodash/isEqual';
import React from 'react';
import { bindUniform, createShaderProgram, Uniform } from './utils';
import { float, vec2 } from '../../utils/layouts';
import { useInViewRef } from '../../hooks/useInView';
import { useRaf } from '../../hooks/useRaf';
import { ObjectOf } from '../../utils/types';

function initBuffers(gl: WebGLRenderingContext) {
  //Some Vertex Data
  // prettier-ignore
  var vertices = new Float32Array( [
    -1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0,
     1.0, -1.0, 0.0
  ]);
  //Create A Buffer
  const vertexBuffer = gl.createBuffer();
  //Bind it to Array Buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //Allocate Space on GPU
  gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.STATIC_DRAW);
  //Copy Data Over, passing in offset
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  //Some Index Data
  var indices = new Uint16Array([0, 1, 3, 2]);
  //Create A Buffer
  const indexBuffer = gl.createBuffer();
  //Bind it to Element Array Buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  //Allocate Space on GPU
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices.byteLength, gl.STATIC_DRAW);
  //Copy Data Over, passing in offset
  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices);

  return { vertexBuffer, indexBuffer };
}

type Props = {
  src: string;
  width: number;
  height: number;
  className: string;
  fragmentShader: string;
  uniforms: (v: any) => ObjectOf<Uniform>;
  fixed?: boolean;
};

const ImaginaryImageCanvas = ({
  width,
  height,
  className,
  fragmentShader,
  uniforms,
  fixed = false
}: Props) => {
  const attribLocationsRef = React.useRef({});
  const uniformLocationsRef = React.useRef({});
  const el = React.useRef<HTMLCanvasElement>();
  const [inViewRef] = useInViewRef(el);
  const glRef = React.useRef<WebGLRenderingContext>();
  const programRef = React.useRef<WebGLProgram>();
  const start = React.useRef(0);
  const uniformRef = React.useRef<ObjectOf<Uniform>>();

  const getAttribLocation = React.useCallback(name => {
    if (!attribLocationsRef.current[name])
      attribLocationsRef.current[name] = glRef.current.getAttribLocation(
        programRef.current,
        name
      );

    return attribLocationsRef.current[name];
  }, []);

  const getUniformLocation = React.useCallback(name => {
    if (!uniformLocationsRef.current[name])
      uniformLocationsRef.current[name] = glRef.current.getUniformLocation(
        programRef.current,
        name
      );

    return uniformLocationsRef.current[name];
  }, []);

  const init = React.useCallback(() => {
    start.current = Date.now();
    glRef.current = el.current.getContext('webgl');

    const vertexShader = `
      #ifdef GL_ES
      precision lowp float;
      #endif
      attribute vec3 position;

      void main(void) {
        gl_Position = vec4(position,1.0);
      }
    `;

    programRef.current = createShaderProgram(
      glRef.current,
      vertexShader,
      fragmentShader
    );

    const { vertexBuffer, indexBuffer } = initBuffers(glRef.current);

    //Enable Position Attribute
    const positionLocation = getAttribLocation('position');
    glRef.current.enableVertexAttribArray(positionLocation);
    //Bind Vertex Buffer
    glRef.current.bindBuffer(glRef.current.ARRAY_BUFFER, vertexBuffer);
    ///Point to Attribute (loc, size, datatype, normalize, stride, offset)
    glRef.current.vertexAttribPointer(
      positionLocation,
      3,
      glRef.current.FLOAT,
      false,
      0,
      0
    );
    //Bind Index Buffer
    glRef.current.bindBuffer(glRef.current.ELEMENT_ARRAY_BUFFER, indexBuffer);
  }, [fragmentShader, getAttribLocation]);

  React.useEffect(init, [init]);

  React.useEffect(() => {
    if (glRef.current)
      glRef.current.viewport(
        0,
        0,
        glRef.current.drawingBufferWidth,
        glRef.current.drawingBufferHeight
      );
  }, [width, height]);

  useRaf(
    React.useCallback(() => {
      const newUniforms = uniforms({
        time: float(Date.now() - start.current),
        resolution: vec2([width, height])
      });

      const preventDisplay = !inViewRef.current && !fixed;

      if (preventDisplay || isEqual(newUniforms, uniformRef.current)) return;

      uniformRef.current = newUniforms;

      for (const [key, value] of Object.entries(newUniforms)) {
        bindUniform(glRef.current, getUniformLocation(`u_${key}`), value);
      }

      glRef.current.drawElements(
        glRef.current.TRIANGLE_STRIP,
        4,
        glRef.current.UNSIGNED_SHORT,
        0
      );
    }, [getUniformLocation, height, inViewRef, uniforms, width])
  );

  return (
    <canvas ref={el} className={className} width={width} height={height} />
  );
};

export default ImaginaryImageCanvas;
