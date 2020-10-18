import isEqual from 'lodash/isEqual';
import { useRef, useEffect, useCallback } from 'react';
import * as m4 from '../../utils/m4';
import { bindUniform, createShaderProgram, Uniform } from './utils';
import { getBestImagePosition, float, vec2, mat4 } from '../../utils/layouts';
import { useInViewRef } from '../../hooks/useInView';
import { useRaf } from '../../hooks/useRaf';
import { Extend, ObjectOf } from '../../utils/types';

// when the image has loaded
type TextureInfo = { width: number; height: number; texture: WebGLTexture };

function loadImageAndCreateTextureInfo(
  glRef: React.RefObject<WebGLRenderingContext>,
  url: string
): Promise<TextureInfo> {
  const tex = glRef.current.createTexture();
  glRef.current.bindTexture(glRef.current.TEXTURE_2D, tex);

  // let's assume all images are not a power of 2
  glRef.current.texParameteri(
    glRef.current.TEXTURE_2D,
    glRef.current.TEXTURE_WRAP_S,
    glRef.current.CLAMP_TO_EDGE
  );
  glRef.current.texParameteri(
    glRef.current.TEXTURE_2D,
    glRef.current.TEXTURE_WRAP_T,
    glRef.current.CLAMP_TO_EDGE
  );
  glRef.current.texParameteri(
    glRef.current.TEXTURE_2D,
    glRef.current.TEXTURE_MIN_FILTER,
    glRef.current.LINEAR
  );

  const img = new Image();

  return new Promise<TextureInfo>((resolve, reject) => {
    img.addEventListener('load', () => {
      if (!glRef.current) reject(new Error('glRef was unassigned'));

      glRef.current.bindTexture(glRef.current.TEXTURE_2D, tex);
      glRef.current.texImage2D(
        glRef.current.TEXTURE_2D,
        0,
        glRef.current.RGBA,
        glRef.current.RGBA,
        glRef.current.UNSIGNED_BYTE,
        img
      );

      resolve({
        width: img.width,
        height: img.height,
        texture: tex
      });
    });
    img.addEventListener('error', reject);
    img.src = url;
  });
}

type Props = Extend<
  React.HTMLAttributes<HTMLCanvasElement>,
  {
    src: string;
    width: number;
    height: number;
    className: string;
    fragmentShader: string;
    uniforms: (v: any) => ObjectOf<Uniform>;
  }
>;

const ImaginaryImageCanvas = ({
  src,
  width,
  height,
  className,
  fragmentShader,
  uniforms,
  ...props
}: Props) => {
  const attribLocationsRef = useRef({});
  const uniformLocationsRef = useRef({});
  const el = useRef<HTMLCanvasElement>(null);
  const [inViewRef] = useInViewRef(el);
  const glRef = useRef<WebGLRenderingContext>();
  const programRef = useRef<WebGLProgram>();
  const textureInfoRef = useRef<TextureInfo>();
  const start = useRef(0);
  const uniformRef = useRef({});

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

  const bindImage = useCallback(
    tex => {
      glRef.current.bindTexture(glRef.current.TEXTURE_2D, tex);

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
    },
    [getAttribLocation, getUniformLocation]
  );

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

    return () => {
      if (loseContextExtension) loseContextExtension.loseContext();
      glRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!glRef.current) return;
    let shouldIgnore = false;

    loadImageAndCreateTextureInfo(glRef, src)
      .then(textureInfo => {
        if (shouldIgnore) return;
        textureInfoRef.current = textureInfo;
        bindImage(textureInfo.texture);
      })
      .catch(e => console.error(e));

    () => (shouldIgnore = true);
  }, [src]);

  useEffect(() => {
    if (glRef.current)
      glRef.current.viewport(
        0,
        0,
        glRef.current.drawingBufferWidth,
        glRef.current.drawingBufferHeight
      );
  }, [width, height]);

  useRaf(
    useCallback(() => {
      const newUniforms = uniforms({
        time: float(Date.now() - start.current),
        resolution: vec2([width, height])
      });

      if (
        !glRef.current ||
        !textureInfoRef.current ||
        !inViewRef.current ||
        isEqual(newUniforms, uniformRef.current)
      )
        return;

      uniformRef.current = newUniforms;

      bindImage(textureInfoRef.current.texture);

      const position = getBestImagePosition({
        imageWidth: textureInfoRef.current.width,
        imageHeight: textureInfoRef.current.height,
        containerWidth: width,
        containerHeight: height
      });

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
    }, [bindImage, getUniformLocation, height, inViewRef, uniforms, width])
  );

  return (
    <canvas
      ref={el}
      className={className}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default ImaginaryImageCanvas;
