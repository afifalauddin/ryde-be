import express, { type Request, type Response, type Router } from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenAPIDocument } from "./document.generator";

export const docsRouter: Router = express.Router();
const openAPIDocument = generateOpenAPIDocument(); //all the swagger route would be here

docsRouter.get("/swagger.json", (_: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openAPIDocument);
}); //serve swagger

docsRouter.use("/", swaggerUi.serve, swaggerUi.setup(openAPIDocument));
