const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

describe("GET /api/messages", () => {
  test("returns empty messages initially", async () => {
    const res = await api.get("/api/messages").expect(200).expect("Content-Type", /json/);
    expect(res.body.data.messages).toHaveLength(0);
    expect(res.body.data.hasMore).toBe(false);
  });
});

describe("POST /api/messages", () => {
  test("creates a text message", async () => {
    const res = await api.post("/api/messages").field("text", "Hello test message").expect(200).expect("Content-Type", /json/);
    expect(res.body.data.message_text).toBe("Hello test message");
    expect(res.body.data.message_id).toBeDefined();
    expect(res.body.data.message_creation_time).toBeDefined();
  });
});
