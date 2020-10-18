export type Bool = { type: 'bool'; value: boolean };
export type Float = { type: 'float'; value: number };
export type Vec2 = { type: 'vec2'; value: number[] };
export type Vec3 = { type: 'vec3'; value: number[] };
export type Vec4 = { type: 'vec4'; value: number[] };
export type Mat2 = { type: 'mat2'; value: number[] };
export type Mat3 = { type: 'mat3'; value: number[] };
export type Mat4 = { type: 'mat4'; value: number[] };
export type Texture = { type: 't'; value: WebGLTexture };

export type Uniform =
  | Bool
  | Float
  | Vec2
  | Vec3
  | Vec4
  | Mat2
  | Mat3
  | Mat4
  | Texture;

export const bindUniform = (
  gl: WebGLRenderingContext,
  location: WebGLUniformLocation,
  uniform: Uniform
) => {
  switch (uniform.type) {
    case 'float':
      gl.uniform1f(location, uniform.value); // for float
      break;
    case 'vec2':
      gl.uniform2fv(location, uniform.value); // for vec2 or vec2 array
      break;

    case 'vec3':
      gl.uniform3fv(location, uniform.value); // for vec3 or vec3 array
      break;

    case 'vec4':
      gl.uniform4fv(location, uniform.value); // for vec4 or vec4 array
      break;

    case 'mat2':
      gl.uniformMatrix2fv(location, false, uniform.value); // for mat2 or mat2 array
      break;

    case 'mat3':
      gl.uniformMatrix3fv(location, false, uniform.value); // for mat2 or mat2 array
      break;

    case 'mat4':
      gl.uniformMatrix4fv(location, false, uniform.value); // for mat2 or mat2 array
      break;
  }
};

export const createShader = (
  gl: WebGLRenderingContext,
  type: number,
  shaderSource: string
): WebGLShader => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(
      `Shader Compilation Error : ${gl.getShaderInfoLog(shader)}`
    );
  }

  return shader;
};

export const createShaderProgram = (
  gl: WebGLRenderingContext,
  vertexShader: string,
  fragShader: string
) => {
  const shaderProgram = gl.createProgram();
  gl.attachShader(
    shaderProgram,
    createShader(gl, gl.VERTEX_SHADER, vertexShader)
  );
  gl.attachShader(
    shaderProgram,
    createShader(gl, gl.FRAGMENT_SHADER, fragShader)
  );
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  return shaderProgram;
};
