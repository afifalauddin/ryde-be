import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

// Register the Auth Component with Bearer Token
export function registerAuthSchemas(registry: OpenAPIRegistry) {
  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Enter your JWT token in the format: Bearer <token>",
  });
}
