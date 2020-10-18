precision lowp float;

uniform bool noTransition;
uniform lowp vec2 iResolution;
uniform lowp float iDevicePixelRatio;
uniform lowp float progress;
uniform lowp float grainOpacity;
uniform lowp float scrollY;
uniform lowp vec4 color;
uniform lowp vec4 startColor;
uniform lowp vec4 endColor;
uniform sampler2D noiseTexture;
uniform sampler2D grainTexture;

vec4 getGrainTextureColor() {
  return mix(
    vec4(0.),
    texture2D(
      grainTexture,
      fract(
          (
            gl_FragCoord.xy / (iResolution.y / 1.3) +
            // parallax
            vec2(0.0, scrollY / (iResolution.y * 1.4 / iDevicePixelRatio))
          ) * 2.
      )
    ),
    grainOpacity
  );
}

vec4 getNoiseTextureColor() {
  return texture2D(
    noiseTexture,
    fract(gl_FragCoord.xy / (iResolution.y * 1.5))
  );
}

#ifdef NO_GRAIN
#define grainTextureColor vec4(0.)
#else
#define grainTextureColor getGrainTextureColor()
#endif

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  vec4 transitionColor = noTransition
    ? color / vec4(255.0)
    : mix(
      endColor / vec4(255.0),
      startColor / vec4(255.0),
      vec4(
        vec3(
            smoothstep(0.5, 1.0,
              getNoiseTextureColor() + (uv.y + 0.2 - (progress * 1.4)) * 7.0
            )
        ),
        1.0
      )
    );

  gl_FragColor = mix(
    transitionColor,
    grainTextureColor,
    vec4(0.35) * grainTextureColor.w
  );
}
