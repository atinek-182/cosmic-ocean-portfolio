uniform float uTime;

varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Simple sine wave displacement
    float elevation = sin(modelPosition.x * 0.2 + uTime) * 
                      sin(modelPosition.z * 0.2 + uTime) * 1.5;
                      
    modelPosition.y += elevation;
    
    // Pass elevation to fragment shader for color grading
    vElevation = elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}
