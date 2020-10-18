#pragma glslify: blur = require('glsl-fast-gaussian-blur/13')
#pragma glslify: n2rand = require('./videoNoise')

precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform float opacity;
uniform sampler2D texture;
varying mediump vec2 vUv;


void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  vec4 black = vec4(13., 13., 13., 255.) / vec4(255.);
  vec4 color = mix(
    blur(texture, vUv, iResolution.xy, vec2(2.)),
    black,
    .9
  );

  vec4 noise = vec4(vec3(n2rand(uv, iTime / 1000.)), 1.0);
  
  gl_FragColor = mix(vec4(0.), mix(color, noise, .25), opacity);
}
