package main

import (
	"encoding/json"
	"fmt"

	"github.com/nats-io/nats.go"
)

type AgentMessage struct {
	Headers struct {
		Intent string `json:"intent"`
	} `json:"headers"`
	Payload struct {
		Input struct {
			Text string `json:"text"`
		} `json:"input"`
	} `json:"payload"`
}

func main() {
	nc, err := nats.Connect("nats://nats:4222")
	if err != nil {
		panic(err)
	}

	_, err = nc.Subscribe("a2a.intent.summarize.>", func(m *nats.Msg) {
		var msg AgentMessage
		err := json.Unmarshal(m.Data, &msg)
		if err != nil {
			fmt.Println("❌ Failed to decode message:", err)
			return
		}

		fmt.Println("📨 Received message:")
		fmt.Printf("%+v\n", msg)

		if msg.Headers.Intent == "summarize.article" {
			fmt.Println("🧠 Agent Beta is summarizing:", msg.Payload.Input.Text)
			summary := msg.Payload.Input.Text
			if len(summary) > 20 {
				summary = summary[:20] + "... (summary)"
			}
			fmt.Println("✅ Summary:", summary)
		}
	})
	if err != nil {
		panic(err)
	}

	fmt.Println("🧠 Agent Beta is listening on 'a2a.intent.summarize'")
	select {}
}
