#version 300 es
// particle.vert

layout(location = 0) in vec4 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform vec4  u_color;
uniform float u_pointSize;

out vec4 color;

void main(void) {
  color = u_color;
  // gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position.x, 0.0, 0.0, 1.0);
  gl_Position  = u_projectionMatrix * u_viewMatrix * vec4(a_position.xyz, 1.0);
  gl_PointSize = u_pointSize;
}
