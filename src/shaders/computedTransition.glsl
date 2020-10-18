#pragma glslify: n2rand = require('./videoNoise')
#pragma glslify: cnoise = require('./cnoise')


precision mediump float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform float progress;
uniform float scrollY;
uniform vec4 startColor;
uniform vec4 endColor;
uniform sampler2D grainTexture;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

vec2 coord(in vec2 p) {
  p = p / iResolution.xy;
  // correct aspect ratio
  if (iResolution.x > iResolution.y) {
    p.x *= iResolution.x / iResolution.y;
    p.x += (iResolution.y - iResolution.x) / iResolution.y / 2.0;
  } else {
    p.y *= iResolution.y / iResolution.x;
    p.y += (iResolution.x - iResolution.y) / iResolution.x / 2.0;
  }
  // centering
  p -= 0.5;
  p *= vec2(-1.0, 1.0);
  return p;
}
#define st coord(gl_FragCoord.xy)

float noise1(in vec2 pixels) {
  vec2 skewedSt = pixels * vec2(0.17, 0.005);
  return 0.4 + (1.0 + n2rand(st.xy, 2.0)) / 2.0 * cnoise(vec3(skewedSt.xy, 0.7));
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  vec4 grainTextureColor = texture2D(
    grainTexture,
    fract(uv * 2. + vec2(0.0, scrollY / iResolution.y * .5))
  );

  vec4 transitionColor =
    progress < .05
      ? startColor / vec4(255.0)
      : progress > .95
      ? endColor / vec4(255.0)
      : mix(
        endColor / vec4(255.0),
        startColor / vec4(255.0),
        vec4(
          vec3(
              smoothstep(0.5, 1.0,
                noise1(gl_FragCoord.xy) + (uv.y + 0.2 - (progress * 1.4)) * 7.0
              )
          ),
          1.0
        )
      );

  gl_FragColor = mix(
    transitionColor,
    grainTextureColor,
    vec4(0.02)
  );
}
