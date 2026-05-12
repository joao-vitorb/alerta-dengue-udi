export type Point = [number, number];

export function isPointInsidePolygon(
  point: Point,
  polygonRings: number[][][],
): boolean {
  if (polygonRings.length === 0) return false;

  const [outerRing, ...holes] = polygonRings;

  if (!isPointInsideRing(point, outerRing as Point[])) return false;

  return !holes.some((hole) => isPointInsideRing(point, hole as Point[]));
}

export function squaredDistance(a: Point, b: Point): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function isPointInsideRing(point: Point, ring: Point[]): boolean {
  const [x, y] = point;
  let isInside = false;

  for (
    let current = 0, previous = ring.length - 1;
    current < ring.length;
    previous = current, current += 1
  ) {
    const [xi, yi] = ring[current];
    const [xj, yj] = ring[previous];

    const intersectsRay =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersectsRay) {
      isInside = !isInside;
    }
  }

  return isInside;
}
