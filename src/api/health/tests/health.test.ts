import request from "supertest";
import { app } from "~/server";
import { Response } from "express";

describe("Health Check API endpoints", () => {
  it("GET / - success", async () => {
    const response = await request(app).get("/");
    const body: Response = response.body;

    expect(response.statusCode).toEqual(200);
    expect(body.success).toBeTruthy();
    expect(body.messsage).toString();
    expect(body.data).toMatchObject({ status: "OK" });
    expect(body.path).toEqual("/");
  });
});
