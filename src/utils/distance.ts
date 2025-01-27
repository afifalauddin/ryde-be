import { Coordinate } from "~/types/geo";

/**
 * Calculate the distance between two points on the Earth's surface
 * using the Haversine formula.
 * @param source - Source coordinate
 * @param target - Target coordinate
 * @returns The distance between the two points in meters
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 * @source: https://www.movable-type.co.uk/scripts/latlong.html
 */
export const getDistance = (source: Coordinate, target: Coordinate) => {
  const earthRadiusInMeters = 6371e3; // Earth's radius in meters
  const lat1InRadians = (source.lat * Math.PI) / 180;
  const lat2InRadians = (target.lat * Math.PI) / 180;
  const latDifferenceInRadians = ((target.lat - source.lat) * Math.PI) / 180;
  const lngDifferenceInRadians = ((target.lng - source.lng) * Math.PI) / 180;

  const haversineFormula =
    Math.sin(latDifferenceInRadians / 2) *
      Math.sin(latDifferenceInRadians / 2) +
    Math.cos(lat1InRadians) *
      Math.cos(lat2InRadians) *
      Math.sin(lngDifferenceInRadians / 2) *
      Math.sin(lngDifferenceInRadians / 2);

  const angularDistance =
    2 *
    Math.atan2(Math.sqrt(haversineFormula), Math.sqrt(1 - haversineFormula));

  return earthRadiusInMeters * angularDistance;
};
