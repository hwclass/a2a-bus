# 📨 a2a-bus — A Reference Event Bus for Agent-to-Agent (A2A) Protocols

*__Because the ideas are:__*

🧠 Agents shouldn’t have to call each other directly.  
📨 Let them speak in events.

**a2a-bus** is a schema-first, event-driven messaging architecture for intelligent agents that want to talk to each other — but without tight coupling or direct calls.

Instead of HTTP-based (direct) communication between agents, this repo demonstrates how to:
- 🧠 **Publish and consume events** over Kafka or NATS JetStream (w/ Docker Compose, but TODO)
- 📨 **Standardize event structure** using JSON Schema, Avro, and Protobuf
- 🔁 **Simulate multi-agent flows** with testing tools and local dev setups

> 🧪 Whether you're building tool-using LLM agents, multi-agent systems, or AI-native protocols — this repo is here to help you scale communication via topics, not endpoints.

---

## ✨ Why This Exists

Agent-to-agent (A2A) interoperability is emerging as a core challenge in the LLM and multi-agent ecosystem. Most current implementations are:
- tightly coupled via REST/webhook calls,
- hard to trace or replay,
- lacking shared message schemas,
- or too brittle to generalize.

This repo proposes a reference architecture using:
- 🧠 **loosely coupled agents**,
- 📨 **brokered event flows**,
- 📜 **shared schema contracts**, and
- 🔁 **tooling to simulate, replay, and debug interactions.**

Inspired by Google’s [A2A protocol vision](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/), but focused on real-world, event-driven backends.

---

## 📁 What’s Inside

a2a-bus/
├── schema/                 # 📜 JSON, Avro, and Proto3 message schemas  
├── ts/                     # 🧠 TypeScript agents (publisher, subscriber)  
├── go/                     # 🧠 Go-based agent implementations  
├── python/                 # 🧠 Python publisher/consumer samples  
├── docker/                 # 🐳 Kafka, Schema Registry, NATS JetStream  
├── tools/                 # 🔁 Simulator & testing CLI to publish A2A events  
└── README.md               # You are here.

---

## 🧪 Core Achievements

- ✅ Multi-language agents (TS, Go, Python) all speaking A2A
- ✅ Brokered communication over NATS using intent-based topics
- ✅ Schema-driven message formats (JSON Schema, Avro, Proto)
- ✅ CLI simulator agent for sending test messages and testing flows
- ✅ Docker Compose setup for local development and orchestration
- ✅ Standardized event format (`headers`, `payload`, `meta`) per A2A guidelines
- ✅ Message replay and test automation support (via `test.sh`)

---

## 🔧 Quickstart

```bash
# 1. Start all agents and brokers
docker compose up --build

# 2. Run a test message using the CLI simulator
./test.sh summarize.article "Hello from simulator"
```

Alternatively, invoke it manually:

```bash
docker compose run --rm simulator summarize.article "Hello from simulator"
```

Agents subscribed to the intent will receive the event and act on it.

---

## 🧰 Simulator CLI Tool

Located in `tools/`, the simulator can send any valid A2A event:

```bash
# Usage
docker compose run --rm simulator <intent> "<text>"

# Example
docker compose run --rm simulator summarize.article "Summarize this input text"
```

🧠 Use it to trigger agent flows, test message schemas, or script behaviors via `test.sh`.

---

## 🔑 Schema Notes

Please use `schema/` definitions to ensure contract-based communication. Extend with your own tools, agents, or topics.

The schemas do **not hardcode allowed values** for intent, which is a deliberate and extensible choice. This allows agents to define new intents freely, including `"summarize.article"`, `"translate.snippet"`, `"search.docs"`, etc.

---

## 🧑‍🤝‍🧑 Want to Contribute?

This project is early-stage, naive, and meant to inspire more robust agent bus standards. We welcome:
- 👀 feedback on schema design  
- 💬 proposals for message types and routing  
- 🔌 adapters for new brokers or runtimes  
- 🧪 examples of agents in action

Open an issue or pull request — or just fork and experiment.

---

## 📜 License

[Apache 2.0](./LICENSE)
