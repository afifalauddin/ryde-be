import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { authRegistry } from "~/api/auth/auth.route";
import { userRegistry } from "~/api/user/user.route";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([authRegistry, userRegistry]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "0.0.1",
      title: "RYDE USER API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Spec",
      url: "/docs/swagger.json",
    },
  });
}
