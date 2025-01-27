import { z } from "zod";

//TODO: Figure out the proper way to validate geo coordinates more throughly
export const latitude = z
  .number()
  .min(-90, { message: "Latitude must be between -90 and 90" })
  .max(90, { message: "Latitude must be between -90 and 90" });

export const longitude = z
  .number()
  .min(-180, { message: "Longitude must be between -180 and 180" })
  .max(180, { message: "Longitude must be between -180 and 180" });

export const CoordinateSchema = z.object({
  lat: latitude,
  lng: longitude,
});

export type Coordinate = z.infer<typeof CoordinateSchema>;
