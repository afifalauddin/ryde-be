import { getDistance } from "../distance";
import { Coordinate } from "~/types/geo";

describe("getDistance", () => {
  it("should calculate the distance between two points correctly", () => {
    const pointA: Coordinate = { lat: 3.1319197, lng: 101.6840589 }; // KUL
    const pointB: Coordinate = { lat: 1.352083, lng: 103.819836 }; // SG

    const distance = getDistance(pointA, pointB);

    console.log(distance);

    expect(distance).toBeCloseTo(308994, 0); // Approximate distance in meters
  });

  it("should return 0 when the points are the same", () => {
    const pointA: Coordinate = { lat: 1.504336, lng: 103.87604 }; // London
    const distance = getDistance(pointA, pointA);

    expect(distance).toBe(0);
  });

  it("should handle points on the equator", () => {
    const pointA: Coordinate = { lat: 0, lng: 0 };
    const pointB: Coordinate = { lat: 0, lng: 90 };

    const distance = getDistance(pointA, pointB);

    expect(distance).toBeCloseTo(10007543, 0); // Approximate distance in meters
  });

  it("should handle points on the same longitude", () => {
    const pointA: Coordinate = { lat: 0, lng: 0 };
    const pointB: Coordinate = { lat: 90, lng: 0 };

    const distance = getDistance(pointA, pointB);

    expect(distance).toBeCloseTo(10007543, 0); // Approximate distance in meters
  });
});
