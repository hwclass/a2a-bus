import json
import uuid
from datetime import datetime
import asyncio
from nats.aio.client import Client as NATS

async def run():
    nc = NATS()
    await nc.connect(servers=["nats://localhost:4222"])

    message = {
        "event_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "type": "agent.message",
        "version": "a2a.v1",
        "headers": {
            "from": "agent://alpha",
            "to": "agent://beta",
            "intent": "summarize.article"
        },
        "payload": {
            "input": { "text": "Hello from the Python Agent!" },
            "tools": ["summarizer"],
            "context": {
                "user_id": "u-123",
                "session_id": "s-456",
                "language": "en"
            }
        },
        "meta": {
            "content_type": "application/json",
            "encoding": "utf-8",
            "schema_uri": "https://a2a.dev/schema/v1/agent-message.json"
        }
    }

    print("🧠 Publishing message to 'a2a.intent.summarize'")
    await nc.publish("a2a.intent.summarize", json.dumps(message).encode())
    await nc.drain()

asyncio.run(run())
