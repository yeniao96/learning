// 漫反射
float calcDiffuse (vec3 l, vec3 n, float k, float r, float i) {
    float percent = max(0.0, dot(l, n) / r);
    return k * (i / pow(r, 2.0)) * percent;
}
// 高光
float calcHighlights (vec3 l, vec3 n, vec3 v, float k, float r, float i) {
    vec3 h = ( l + v ) / length(l + v);
    float percent = max(0.0, dot(n, h));
    return k * (i / pow(r, 2.0)) * pow(percent, 100.0);
}
// 环境光
float calcAmbient (float k, float i) {
    return k * i;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec2 uv = fragCoord / iResolution.xy;
    uv.x -= 0.5;
    uv.y -= 0.5;
    float scale = iResolution.x / iResolution.y;
    uv.x *= scale;

    vec3 center = vec3(0.0, 0.0, 0.0);
    vec3 light = vec3(-0.4, 0.5, 0.4);
    vec3 viewer = vec3(0.0, 0.0, 1.0);

    vec3 color;
    vec3 lightColor = vec3(1.0,1.0,1.0);
    float i = 1.0;
    float R = 0.1;
    float k1 = 0.2;
    float k2 = 0.5;
    float k3 = 0.1;

    if(pow(uv.x-center.x, 2.0) + pow(uv.y-center.y, 2.0) < R){ 
        color = vec3(0.0, 0.0, 0.0);
        float z = sqrt(pow(R, 2.0) - (pow(uv.x, 2.0) + pow(uv.y, 2.0)));
        vec3 p = vec3(uv.xy, z);
        vec3 l = light - p;
        vec3 n = (p - center) / length(p - center);
        float d1 = calcDiffuse(l, n, k1, length(l), i);
        float d2 = calcHighlights(l, n, viewer, k2, length(l), i);
        float d3 = calcAmbient(k3, i);
        color = color + (d1 + d2 + d3) * lightColor;
    }
    fragColor = vec4( color , 1.0 );
}