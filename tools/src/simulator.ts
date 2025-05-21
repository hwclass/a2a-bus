import { connect, StringCodec } from "nats";
import { v4 as uuidv4 } from "uuid";

// CLI usage: ts-node simulator.ts summarize.article "Your message text here"

console.log("Arguments received:", process.argv);

const [, , intentArg, ...textParts] = process.argv;

if (!intentArg || textParts.length === 0) {
  console.error("❌ Usage: ts-node simulator.ts <intent> '<message text>'");
  console.error("Received arguments:", { intentArg, textParts });
  process.exit(1);
}

const intent = intentArg;
const text = textParts.join(" ");
const subject = `a2a.intent.${intent}`;

const sc = StringCodec();

async function run() {
  try {
    console.log("Connecting to NATS...");
    const nc = await connect({ servers: ["nats://nats:4222"] });
    console.log("Connected to NATS successfully");

    const message = {
      event_id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: "agent.message",
      version: "a2a.v1",
      headers: {
        from: process.env.A2A_FROM || "agent://simulator",
        to: "agent://*",
        intent
      },
      payload: {
        input: { text },
        tools: [intent.split(".")[0]],
        context: {
          user_id: "test-user",
          session_id: "session-sim",
          language: "en"
        }
      },
      meta: {
        content_type: "application/json",
        encoding: "utf-8",
        schema_uri: "https://a2a.dev/schema/v1/agent-message.json"
      }
    };

    console.log(`🧪 Simulating event: '${intent}'`);
    console.log("📤 Publishing to subject:", subject);
    console.log("📦 Message payload:", JSON.stringify(message, null, 2));

    nc.publish(subject, sc.encode(JSON.stringify(message)));

    await nc.flush();
    await nc.close();

    console.log("✅ Event published successfully.");
  } catch (err) {
    console.error("❌ Error in run():", err);
    throw err;
  }
}

run().catch((err) => {
  console.error("❌ Failed to send event:", err);
  process.exit(1);
});
