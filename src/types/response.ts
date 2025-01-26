import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  totalItems: z.number().int().min(0),
});

export const BaseResponseSchema = z.object({
  success: z.boolean(),
  timestamp: z.string().datetime(),
  path: z.string(),
  message: z.string().optional(),
});

export const SuccessResponseSchema = BaseResponseSchema.extend({
  success: z.literal(true),
  data: z.unknown(),
  pagination: PaginationSchema.optional(),
});

export const ErrorResponseSchema = BaseResponseSchema.extend({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
