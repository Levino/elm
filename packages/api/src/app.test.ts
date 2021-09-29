import { Context, setup, teardown } from "../test/testContext";
import { createApp } from "./";
import request from "supertest";

describe("express app", () => {
  describe("Write and read", () => {
    let context: Context;
    beforeEach(async () => {
      context = await setup();
    });
    afterEach(() => teardown(context));
    it("Should be able to write and read a todo.", async () => {
      const app = await createApp({ mysql: context.mysql });
      await request(app)
        .post("/graphql")
        .send({
          query: `mutation {addTodo(title: "title",description: "description") {id}}`,
        })
        .expect(200);
      const response = await request(app)
        .post("/graphql")
        .send({
          query: `
            {
              todos {
                description
              }
            }
          `,
        })
        .expect(200);
      expect(response.body.data.description).toEqual("description");
    });
  });
});
