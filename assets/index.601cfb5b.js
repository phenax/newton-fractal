import{G as v}from"./vendor.39fd84d0.js";const m=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function u(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(e){if(e.ep)return;e.ep=!0;const o=u(e);fetch(e.href,o)}};m();const p=`#define MAX_ITERATIONS 200

precision mediump float;
varying vec2 _pos;

uniform vec2 u_resolution;

// values
uniform vec2 a;

float fabs(float a) { return a > 0. ? a : -a; }

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

vec2 cdiv(vec2 a, vec2 b) {
  float denominator = b.x*b.x + b.y*b.y;
  if (denominator == 0.) return a;
  return cmul(a, vec2(b.x, -b.y)) / denominator;
}

vec2 cpow(vec2 z, int n) {
  vec2 res = z;
  for (int i = 0; i < 20; i++) {
    if (i >= n - 1) break;
    res = cmul(z, res);
  }
  return res;
}

//vec2 fn(vec2 z) { return cpow(z, 3) - vec2(1., 0.); }
//vec2 dfn(vec2 z) { return 3.0*cpow(z, 2); }

vec2 fn(vec2 z) { return cpow(z, 5) + 2.0*cpow(z, 3) - vec2(1., 0.); }
vec2 dfn(vec2 z) { return 5.0*cpow(z, 4) + 3.0*cpow(z, 2); }

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 xy = (uv - vec2(0.5, 0.5))*3.0;

  vec2 prevZ;
  vec2 z = xy;

  int iterations = 0;
  for (int i = 0; i < MAX_ITERATIONS; i++) {
    prevZ = z;
    z = prevZ - cmul(a, cdiv(fn(prevZ), dfn(prevZ)));

    iterations++;
    if (fabs(z.x - prevZ.x) < 0.001) break;
  }

  float val = float(iterations) * 10.0 / float(MAX_ITERATIONS);
  float g = val * 0.5;
  float b = val * 0.8;

  gl_FragColor = vec4(0.0, g, b, val);
}
`;const t=document.createElement("canvas");document.body.appendChild(t);t.style.border="1px solid pink";const s=()=>{const n=Math.min(window.innerWidth,window.innerHeight);t.width=n,t.height=n};s();window.onresize=s;const l=new v(t);l.load(p);const f=(n,r)=>l.setUniform("a",n,r);f(1,0);let c=!0;const d=(n=-50)=>{const r=Math.max(-.1,Math.min(3,n/500));n=c?n+1:n-1,n===1500?c=!1:n===-50&&(c=!0),f(r,0),window.requestAnimationFrame(d.bind(null,n))};d();
