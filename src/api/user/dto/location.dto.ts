import { z } from "zod";
import { latitude, longitude } from "~/types/geo";

export const locationSchema = z.object({
  latitude: latitude,
  longitude: longitude,
});
