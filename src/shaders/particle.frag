#version 300 es
// particle.frag

precision highp float;

out vec4 FragColor;

in vec4 color;

void main(void) {
  FragColor = color;
}
