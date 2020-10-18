precision mediump float;
uniform bool borderNoise;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
varying mediump vec2 vUv;
uniform sampler2D texture;
uniform sampler2D noiseTexture;
uniform vec2 chromaFactor;
uniform float noiseFactor;
uniform float opacity;
uniform float zoom;
uniform lowp vec4 bgColor;
uniform float imageOpacity;

#define clampedChromaFactor clamp(chromaFactor, vec2(-15., -15.), vec2(15., 15.))

vec2 scale(in vec2 uv, in float factor) {
    return ((uv * 2. - 1.) / factor) / 2. + .5;
}

bool isShifted() {
    return abs(chromaFactor.y) > 0.1 || abs(noiseFactor) > 0.1;
}

vec4 rgbShift(in vec2 uv) {
    vec2 offset = -clampedChromaFactor * vec2(0.0012);

    vec3 col = vec3(
        texture2D(texture, uv).r,
        texture2D(texture, uv + offset * 1.0).g,
        texture2D(texture, uv + offset * 2.0).b
    );

    return vec4(col, 1.0);
}

void main() {
    vec4 displacement = texture2D(
        noiseTexture,
        vUv / 2.
    );

    vec2 uvBend = clampedChromaFactor / 200. * displacement.xy;
    vec2 uv = scale(scale(vUv, zoom), 1.) + uvBend;

    // to see the background when the image is ofscreen, uncomment
    if (borderNoise) {
        if (uv.x > 1. || uv.x < 0.) {
            gl_FragColor = vec4(0.);
            return;
        }

        if (uv.y > 1. || uv.y < 0.) {
            gl_FragColor = vec4(0.);
            return;
        }
    }
    

    vec4 pixel = mix(bgColor / vec4(255.), rgbShift(uv), imageOpacity);

    gl_FragColor = vec4(pixel.rgb, opacity);
}
