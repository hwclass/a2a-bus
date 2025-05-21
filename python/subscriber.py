import json
import asyncio
from nats.aio.client import Client as NATS

async def run():
    nc = NATS()
    await nc.connect(servers=["nats://nats:4222"])

    async def message_handler(msg):
        data = json.loads(msg.data.decode())
        print("📨 Received message:")
        print(json.dumps(data, indent=2))

        if data.get("headers", {}).get("intent") == "summarize.article":
            text = data.get("payload", {}).get("input", {}).get("text", "")
            print("🧠 Agent Beta is summarizing:", text)
            summary = text[:20] + "... (summary)" if len(text) > 20 else text
            print("✅ Summary:", summary)

    await nc.subscribe("a2a.intent.summarize.>", cb=message_handler)

    print("🧠 Agent Beta is listening on 'a2a.intent.summarize'")
    while True:
        await asyncio.sleep(1)

asyncio.run(run())
