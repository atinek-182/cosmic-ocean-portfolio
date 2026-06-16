uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main() {
    // Mix colors based on elevation
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    
    // Add white foam at the very peaks
    if (mixStrength > 0.8) {
        color = mix(color, vec3(1.0, 1.0, 1.0), (mixStrength - 0.8) * 5.0);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
