struct light {
    vec3 pos;
    vec3 color;
    float intensity;
};

struct ball {
    vec3 pos;
    vec3 albedo;
    float radius;
    float roughness;
    float metalic;
};

vec3 viewer = vec3(0.0, 0.0, 1.0);
float PI = acos(-1.0);
vec3 f = vec3(0.04);
// 漫反射
vec3 calcDiffuse (vec3 albedo) {
    return albedo / PI;
}
// 几何遮蔽方程
float GeometrySchlickGGX (vec3 n, vec3 i, float roughness) {
    float k = pow(roughness + 1.0, 2.0) / 8.0;
    float x = max(dot(n, i), 0.0);
    return x / (x * (1.0 - k) + k);
}
// 法线分布方程
float DistributionGGX(vec3 N, vec3 H, float roughness){
    float a      = roughness*roughness;
    float a2     = a*a;
    float NdotH  = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;
    float num   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
    return num / denom;
}

// 菲涅尔系数
vec3 Finel(vec3 F0, vec3 h, vec3 v) {
    return F0 + (vec3(1.0) - F0) * pow(1.0 - max(0.0, dot(h, v)), 5.0);
}

// 高光
vec3 calcHighlights (vec3 l, vec3 n, vec3 v, vec3 F, float roughness) {
    vec3 h = normalize(l + viewer);
    float staticParam = 4.0 * max(dot(v, n), 0.0) * max(dot(l, n), 0.0);
    float D = DistributionGGX(n, h, roughness);
    float G = GeometrySchlickGGX(n, v, roughness) * GeometrySchlickGGX(n, l, roughness);
    return D * F * G / max(staticParam, 0.001);
}

// BRDF
vec3 brdf (light light, ball ball, vec3 p) {
    vec3 color = vec3(0.0);
    vec3 l = light.pos - p;
    vec3 n = (p - ball.pos) / length(p - ball.pos);
    vec3 h = normalize(l + viewer);
    vec3 F0 = mix(f, ball.albedo, ball.metalic);
    vec3 F = Finel(F0, h, viewer);
    vec3 ks = F;
    vec3 kd = (1.0 - ball.metalic) * (vec3(1.0) - F);
    vec3 diffuse = calcDiffuse(ball.albedo);
    vec3 specular = calcHighlights(l, n, viewer, F, ball.roughness);
    vec3 radiance = light.color * (light.intensity / pow(length(l), 2.0)); 
    vec3 Lo = (kd * diffuse + specular) * radiance * max(dot(l, n), 0.0);
    vec3 ambient = vec3(0.03) * ball.albedo;
    color = ambient + Lo;
    // // tonemapping
    color = color / (color + vec3(1.0));
    // // gamma
    color = pow(color, vec3(1.0 / 2.2));
    return color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec2 uv = fragCoord / iResolution.xy;
    uv.x -= 0.5;
    uv.y -= 0.5;
    float scale = iResolution.x / iResolution.y;
    uv.x *= scale;
    light light_ins = light(vec3(0.5 * sin(iTime / 10.0), 0.5 * sin(iTime / 10.0), 0.5), vec3(1.0,1.0,1.0), 2.0);
    vec3 color = vec3(0.1, 0.1, 0.1);
    for(float i = -0.4; i < 0.5; i+=0.2){ 
        for(float j = -0.4; j < 0.5; j+=0.2){ 
            ball ball_ins = ball(
                vec3(i, j, 0.0),
                vec3(1.0, 0.5, 0.1),
                0.05,
                mix(0.1, 1.0, i + 0.5),
                mix(0.1, 1.0, j + 0.5)
            );
            float pz = sqrt(pow(ball_ins.radius, 2.0) - (pow(uv.x - i, 2.0) + pow(uv.y - j, 2.0)));
            vec3 p = vec3(uv.xy, pz);
            if(pow(uv.x-ball_ins.pos.x, 2.0) + pow(uv.y-ball_ins.pos.y, 2.0) < pow(ball_ins.radius, 2.0)){
                color = brdf(light_ins, ball_ins, p);
                break;
            }
        }
    }
    fragColor = vec4( color, 1.0 );
}
