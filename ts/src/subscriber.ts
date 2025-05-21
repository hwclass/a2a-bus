import { connect, StringCodec } from "nats";

const sc = StringCodec();

async function runSubscriber() {
  const nc = await connect({ servers: "nats:4222" });

  const sub = nc.subscribe("a2a.intent.summarize");
  console.log("🧠 Agent Beta is listening on 'a2a.intent.summarize'...");

  for await (const msg of sub) {
    const data = JSON.parse(sc.decode(msg.data));
    console.log("📨 Received message:");
    console.log(JSON.stringify(data, null, 2));

    if (data.headers?.intent === "summarize.article") {
      const text = data.payload?.input?.text || "";
      console.log("🧠 Agent Beta is summarizing:", text);
      // Simulated summary logic
      const summary = text.slice(0, 20) + "... (summary)";
      console.log("✅ Summary:", summary);
    }
  }
}

runSubscriber().catch(console.error);
