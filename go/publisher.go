package main

import (
    "encoding/json"
    "fmt"
    "time"

    "github.com/google/uuid"
    "github.com/nats-io/nats.go"
)

type Headers struct {
    From     string `json:"from"`
    To       string `json:"to"`
    Intent   string `json:"intent"`
}

type Payload struct {
    Input   map[string]string `json:"input"`
    Tools   []string          `json:"tools"`
    Context map[string]string `json:"context"`
}

type Meta struct {
    ContentType string `json:"content_type"`
    Encoding    string `json:"encoding"`
    SchemaURI   string `json:"schema_uri"`
}

type AgentMessage struct {
    EventID   string   `json:"event_id"`
    Timestamp string   `json:"timestamp"`
    Type      string   `json:"type"`
    Version   string   `json:"version"`
    Headers   Headers  `json:"headers"`
    Payload   Payload  `json:"payload"`
    Meta      Meta     `json:"meta"`
}

func main() {
    nc, err := nats.Connect(nats.DefaultURL)
    if err != nil {
        panic(err)
    }
    defer nc.Drain()

    msg := AgentMessage{
        EventID:   uuid.New().String(),
        Timestamp: time.Now().Format(time.RFC3339),
        Type:      "agent.message",
        Version:   "a2a.v1",
        Headers: Headers{
            From:   "agent://alpha",
            To:     "agent://beta",
            Intent: "summarize.article",
        },
        Payload: Payload{
            Input: map[string]string{
                "text": "Hello from the Go Agent!",
            },
            Tools: []string{"summarizer"},
            Context: map[string]string{
                "user_id":    "u-123",
                "session_id": "s-456",
                "language":   "en",
            },
        },
        Meta: Meta{
            ContentType: "application/json",
            Encoding:    "utf-8",
            SchemaURI:   "https://a2a.dev/schema/v1/agent-message.json",
        },
    }

    data, err := json.MarshalIndent(msg, "", "  ")
    if err != nil {
        panic(err)
    }

    fmt.Println("🧠 Publishing message to 'a2a.intent.summarize'")
    nc.Publish("a2a.intent.summarize", data)
}
