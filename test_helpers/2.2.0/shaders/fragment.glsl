uniform vec2 resolution;
uniform float time;

varying vec2 vUv;

float Bayer2(vec2 a) {
  a = floor(a);

  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}

#define Bayer4(a) (Bayer2(0.5 * (a)) * 0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(0.5 * (a)) * 0.25 + Bayer2(a))
#define Bayer16(a) (Bayer8(0.5 * (a)) * 0.25 + Bayer2(a))

#define FBM_OCTAVES 5
#define FBM_LACUNARITY 1.25
#define FBM_GAIN 1.0
#define FBM_SCALE 4.0

float hash11(float n) {
	return fract(sin(n) * 43758.5453);
}

float vnoise(vec3 p) {
  vec3 ip = floor(p);
  vec3 fp = fract(p);

  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));

  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);

  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);

  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);

  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t) {
  vec3 p   = vec3(uv * FBM_SCALE, t);
  float amp  = 1.;
  float freq = 1.;
  float sum  = 1.;

  for (int i = 0; i < FBM_OCTAVES; ++i) {
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }

  return sum * 0.5 + 0.5;
}

const float PIXEL_SIZE = 10.0;
const float CELL_PIXEL_SIZE = 5.0 * PIXEL_SIZE;

void main() {
	float pixelSize = PIXEL_SIZE;
  vec2 fragCoord = gl_FragCoord.xy - resolution * .5;
	float aspectRatio = resolution.x / resolution.y;
	vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);
  float cellPixelSize =  8. * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = ((cellCoord / (resolution) )) * vec2(aspectRatio, 1.0);

	float feed = fbm2(uv, time * 0.025);
  float brightness = -.65;
  float contrast = .5;

  feed = feed * contrast + brightness;

  float bayerValue = Bayer8(fragCoord / pixelSize) - .5;
  float bw = 1.0 - step(0.5, feed + bayerValue);

	gl_FragColor = vec4(vec3(bw), 0.02);
}