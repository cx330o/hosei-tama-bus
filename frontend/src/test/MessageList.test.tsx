import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { BrowserRouter } from "react-router-dom"
import MessageList from "../components/MessageList"
import type { Message } from "../types"

const mockMessages: Message[] = [
  {
    message_id: 1,
    message_creation_time: "2024-09-01T10:00:00.000Z",
    message_text: "<p>Hello world</p>",
    message_files: [],
  },
  {
    message_id: 2,
    message_creation_time: "2024-09-01T11:00:00.000Z",
    message_text: null,
    message_files: [
      {
        file_id: 1,
        file_type: "image/png",
        file_size: 1024,
        file_name: "test.png",
        file_original_name: "screenshot.png",
      },
    ],
  },
]

describe("MessageList", () => {
  it("renders correct number of messages", () => {
    const onDelete = vi.fn()
    render(
      <BrowserRouter>
        <MessageList messages={mockMessages} onDeleteMessage={onDelete} />
      </BrowserRouter>
    )
    const cards = document.querySelectorAll(".message-card")
    expect(cards.length).toBe(2)
  })

  it("renders empty when no messages", () => {
    const onDelete = vi.fn()
    render(
      <BrowserRouter>
        <MessageList messages={[]} onDeleteMessage={onDelete} />
      </BrowserRouter>
    )
    const cards = document.querySelectorAll(".message-card")
    expect(cards.length).toBe(0)
  })
})
