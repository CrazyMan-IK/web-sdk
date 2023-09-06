export type vec2 = {
  x: number;
  y: number;
};

export function vec2Zero() {
  return { x: 0, y: 0 };
}
export function vec2NaN() {
  return { x: NaN, y: NaN };
}

export function addVec2(a: vec2, b: vec2) {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function mulVec2Num(a: vec2, b: number) {
  return { x: a.x * b, y: a.y * b };
}
