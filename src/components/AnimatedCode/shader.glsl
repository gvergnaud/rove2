precision mediump float;
varying mediump vec2 vUv;
uniform sampler2D texture;
uniform vec4 colorRgba;
uniform float opacity;

void main() {
  vec4 color = colorRgba / vec4(255.0);
  vec4 fragColor = mix(
    vec4(0.0),
    color,
    texture2D(texture, vUv).x * opacity
  );

  if (abs(color.x - fragColor.x) > 0.05)
    fragColor.a = 0.;

  gl_FragColor = fragColor;
}
