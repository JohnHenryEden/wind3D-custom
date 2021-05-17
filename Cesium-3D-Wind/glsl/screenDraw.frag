uniform sampler2D trailsColorTexture;
uniform sampler2D trailsDepthTexture;
uniform sampler2D particlesSpeed;

varying vec2 textureCoordinate;

void main() {
    vec4 trailsColor = texture2D(trailsColorTexture, textureCoordinate);
    float trailsDepth = texture2D(trailsDepthTexture, textureCoordinate).r;
    float speed = texture2D(particlesSpeed, textureCoordinate).r;
    float globeDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, textureCoordinate));

    if (trailsDepth < globeDepth) {
        gl_FragColor = trailsColor;
    } else {
        gl_FragColor = vec4(0.0);
    }
}