uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveSpeed;

varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Simple sine wave displacement
    float elevation = sin(modelPosition.x * 0.2 + uTime * uWaveSpeed) * 
                      sin(modelPosition.z * 0.2 + uTime * uWaveSpeed) * uWaveHeight;
                      
    modelPosition.y += elevation;
    
    // Pass elevation to fragment shader for color grading
    vElevation = elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}
