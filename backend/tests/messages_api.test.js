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

  test("creates a message with file upload", async () => {
    const res = await api.post("/api/messages").field("text", "Message with file").attach("files", Buffer.from("test file content"), "test.txt").expect(200);
    expect(res.body.data.message_files).toHaveLength(1);
    expect(res.body.data.message_files[0].file_original_name).toBe("test.txt");
  });
});

describe("GET /api/messages (with data)", () => {
  test("returns messages with pagination info", async () => {
    const res = await api.get("/api/messages").expect(200);
    expect(res.body.data.messages.length).toBeGreaterThan(0);
    expect(res.body.data).toHaveProperty("hasMore");
    expect(res.body.data).toHaveProperty("nextCursor");
  });

  test("supports limit parameter", async () => {
    const res = await api.get("/api/messages?limit=1").expect(200);
    expect(res.body.data.messages).toHaveLength(1);
    expect(res.body.data.hasMore).toBe(true);
    expect(res.body.data.nextCursor).toBeDefined();
  });

  test("supports cursor-based pagination", async () => {
    const firstPage = await api.get("/api/messages?limit=1").expect(200);
    const cursor = firstPage.body.data.nextCursor;
    const secondPage = await api.get(`/api/messages?limit=1&cursor=${cursor}`).expect(200);
    expect(secondPage.body.data.messages).toHaveLength(1);
    expect(secondPage.body.data.messages[0].message_id).not.toBe(firstPage.body.data.messages[0].message_id);
  });
});
