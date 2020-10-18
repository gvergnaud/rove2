import React, { useRef, useEffect, useCallback } from 'react';
import * as m4 from '../../utils/m4';
import { bindUniform, createShaderProgram, Uniform } from './utils';
import { getBestImagePosition, float, vec2, mat4 } from '../../utils/layouts';
import { useInViewRef } from '../../hooks/useInView';
import { useVideo, VideoConfig } from '../../hooks/useVideo';
import { useMouseTracker } from '../../hooks/useMouseTracker';
import { useRaf } from '../../hooks/useRaf';
import { ObjectOf } from '../../utils/types';

function initTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because video has to be download over the internet
  // they might take a moment until it's ready so
  // put a single pixel in the texture so we can
  // use it immediately.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // Turn off mips and set  wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function updateTexture(gl, texture, video) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video
  );
}

type Props = {
  src: VideoConfig;
  width: number;
  height: number;
  className: string;
  fragmentShader: string;
  uniforms: (v: any) => ObjectOf<Uniform>;
  playing?: boolean;
};

const ImaginaryImageCanvas = ({
  src,
  width,
  height,
  className,
  fragmentShader,
  uniforms,
  playing = true
}: Props) => {
  const attribLocationsRef = useRef({});
  const uniformLocationsRef = useRef({});
  const el = useRef<HTMLCanvasElement>();
  const [inViewRef] = useInViewRef(el);
  const glRef = useRef<WebGLRenderingContext>();
  const programRef = useRef<WebGLProgram>();
  const textureRef = useRef<WebGLTexture>();
  const start = useRef(0);
  const [isReady, videoRef] = useVideo(src);

  const getAttribLocation = useCallback(name => {
    if (!attribLocationsRef.current[name])
      attribLocationsRef.current[name] = glRef.current.getAttribLocation(
        programRef.current,
        name
      );

    return attribLocationsRef.current[name];
  }, []);

  const getUniformLocation = useCallback(name => {
    if (!uniformLocationsRef.current[name])
      uniformLocationsRef.current[name] = glRef.current.getUniformLocation(
        programRef.current,
        name
      );

    return uniformLocationsRef.current[name];
  }, []);

  useEffect(() => {
    start.current = Date.now();
    glRef.current = el.current.getContext('webgl');
    const loseContextExtension = glRef.current.getExtension(
      'WEBGL_lose_context'
    );

    // Create a buffer.
    const positionBuffer = glRef.current.createBuffer();
    glRef.current.bindBuffer(glRef.current.ARRAY_BUFFER, positionBuffer);

    // Put a unit quad in the buffer
    // prettier-ignore
    const positions = [
      0, 0, 0,
      1, 1, 0,
      1, 0, 0,
      1, 1, 1
    ];
    glRef.current.bufferData(
      glRef.current.ARRAY_BUFFER,
      new Float32Array(positions),
      glRef.current.STATIC_DRAW
    );

    // Create a buffer for texture coords
    const texcoordBuffer = glRef.current.createBuffer();
    glRef.current.bindBuffer(glRef.current.ARRAY_BUFFER, texcoordBuffer);

    // Put texcoords in the buffer
    const texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    glRef.current.bufferData(
      glRef.current.ARRAY_BUFFER,
      new Float32Array(texcoords),
      glRef.current.STATIC_DRAW
    );

    // Shaders
    const vertexShader = `
      attribute vec4 a_position;
      attribute vec2 a_texcoord;
      uniform mat4 u_matrix;
      varying vec2 v_texcoord;

      void main() {
        gl_Position = u_matrix * a_position;
        v_texcoord = a_texcoord;
      }
    `;

    programRef.current = createShaderProgram(
      glRef.current,
      vertexShader,
      fragmentShader
    );

    // Attributes
    const positionLocation = getAttribLocation('a_position');
    const texcoordLocation = getAttribLocation('a_texcoord');
    glRef.current.enableVertexAttribArray(positionLocation);
    glRef.current.vertexAttribPointer(
      positionLocation,
      2,
      glRef.current.FLOAT,
      false,
      0,
      0
    );
    glRef.current.enableVertexAttribArray(texcoordLocation);
    glRef.current.vertexAttribPointer(
      texcoordLocation,
      2,
      glRef.current.FLOAT,
      false,
      0,
      0
    );

    // Tell the shader to get the texture from texture unit 0
    const textureLocation = getUniformLocation('u_texture');
    glRef.current.uniform1i(textureLocation, 0);

    textureRef.current = initTexture(glRef.current);

    return () => {
      if (loseContextExtension) loseContextExtension.loseContext();
      glRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (glRef.current)
      glRef.current.viewport(
        0,
        0,
        glRef.current.drawingBufferWidth,
        glRef.current.drawingBufferHeight
      );
  }, [width, height]);

  useEffect(() => {
    if (!isReady || !videoRef.current) return;
    const v = videoRef.current;
    if (playing && v.paused) v.play();
    else if (!playing && !v.paused) v.pause();
  }, [playing, videoRef, isReady]);

  useRaf(
    useCallback(() => {
      if (!glRef.current || !isReady || !inViewRef.current) return;

      const newUniforms = uniforms({
        time: float(Date.now() - start.current),
        resolution: vec2([width, height])
      });

      const position = getBestImagePosition({
        imageWidth: videoRef.current.videoWidth,
        imageHeight: videoRef.current.videoHeight,
        containerWidth: width,
        containerHeight: height
      });

      updateTexture(glRef.current, textureRef.current, videoRef.current);

      bindUniform(
        glRef.current,
        getUniformLocation('u_matrix'),
        mat4(
          m4.scale(
            m4.translate(
              m4.orthographic(0, width, height, 0, -1, 1),
              position.x,
              position.y,
              0
            ),
            position.width,
            position.height,
            1
          )
        )
      );

      for (const [key, value] of Object.entries(newUniforms)) {
        bindUniform(glRef.current, getUniformLocation(`u_${key}`), value);
      }

      glRef.current.drawArrays(glRef.current.TRIANGLES, 0, 6);
    }, [
      uniforms,
      width,
      height,
      isReady,
      inViewRef,
      videoRef,
      getUniformLocation
    ])
  );

  return (
    <>
      <canvas ref={el} className={className} width={width} height={height} />
    </>
  );
};

export default ImaginaryImageCanvas;
