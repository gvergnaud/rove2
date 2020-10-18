import {
  Float,
  Vec2,
  Vec3,
  Vec4,
  Mat2,
  Mat3,
  Mat4,
  Texture,
  Bool
} from '../components/ImaginaryCanvas/utils';

export const getBestImagePosition = ({
  imageWidth,
  imageHeight,
  containerWidth,
  containerHeight
}) => {
  if (imageWidth / imageHeight < containerWidth / containerHeight) {
    const width = containerWidth;
    const height = (imageHeight * containerWidth) / imageWidth;

    return {
      width,
      height,
      x: 0,
      y: -Math.abs(height - containerHeight) / 2 || 0
    };
  } else {
    const height = containerHeight;
    const width = (imageWidth * containerHeight) / imageHeight;
    return {
      width,
      height,
      x: -Math.abs(width - containerWidth) / 2 || 0,
      y: 0
    };
  }
};

export const bool = (x: boolean): Bool => ({ type: 'bool', value: x });
export const float = (x: number): Float => ({ type: 'float', value: x });
export const vec2 = (x: number[]): Vec2 => ({ type: 'vec2', value: x });
export const vec3 = (x: number[]): Vec3 => ({ type: 'vec3', value: x });
export const vec4 = (x: number[]): Vec4 => ({ type: 'vec4', value: x });
export const mat2 = (x: number[]): Mat2 => ({ type: 'mat2', value: x });
export const mat3 = (x: number[]): Mat3 => ({ type: 'mat3', value: x });
export const mat4 = (x: number[]): Mat4 => ({ type: 'mat4', value: x });
export const texture = (x: WebGLTexture): Texture => ({ type: 't', value: x });
