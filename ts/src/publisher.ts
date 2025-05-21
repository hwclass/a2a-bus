import { connect, StringCodec } from "nats";
import { v4 as uuidv4 } from "uuid";

const sc = StringCodec();

async function runPublisher() {
  const nc = await connect({ servers: "localhost:4222" });

  const message = {
    event_id: uuidv4(),
    timestamp: new Date().toISOString(),
    type: "agent.message",
    version: "a2a.v1",
    headers: {
      from: "agent://alpha",
      to: "agent://beta",
      intent: "summarize.article"
    },
    payload: {
      input: { text: "Hello from the Alpha Agent!" },
      tools: ["summarizer"],
      context: {
        user_id: "u-123",
        session_id: "s-456",
        language: "en"
      }
    },
    meta: {
      content_type: "application/json",
      encoding: "utf-8",
      schema_uri: "https://a2a.dev/schema/v1/agent-message.json"
    }
  };

  console.log("🧠 Publishing message to 'a2a.intent.summarize'");
  nc.publish("a2a.intent.summarize", sc.encode(JSON.stringify(message)));

  await nc.flush();
  await nc.close();
}

runPublisher().catch(console.error);
