import { useEffect, useRef, useState } from "react"
import type { Message } from "../types"

const url = import.meta.env.VITE_APP_WEBSOCKET_URL
const MAX_RECONNECT_DELAY = 30000
const INITIAL_RECONNECT_DELAY = 1000

interface WebSocketMessage {
  type: string
  message: Message
}

export type ConnectionStatus = "connected" | "disconnected" | "connecting"

const useWebSocket = (onMessageReceived: (message: Message) => void) => {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectDelay = useRef(INITIAL_RECONNECT_DELAY)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [status, setStatus] = useState<ConnectionStatus>("connecting")

  useEffect(() => {
    function connect() {
      setStatus("connecting")
      const ws = new WebSocket(url)
      wsRef.current = ws
      ws.onopen = () => {
        console.log("WebSocket connected")
        reconnectDelay.current = INITIAL_RECONNECT_DELAY
        setStatus("connected")
      }
      ws.onmessage = (event: MessageEvent) => {
        const data: WebSocketMessage = JSON.parse(event.data)
        if (data.type === "newMessage") onMessageReceived(data.message)
      }
      ws.onclose = () => {
        console.log(`WebSocket disconnected. Reconnecting in ${reconnectDelay.current}ms...`)
        setStatus("disconnected")
        scheduleReconnect()
      }
      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        ws.close()
      }
    }

    function scheduleReconnect() {
      reconnectTimer.current = setTimeout(() => {
        reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_RECONNECT_DELAY)
        connect()
      }, reconnectDelay.current)
    }

    connect()

    return () => {
      clearTimeout(reconnectTimer.current!)
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
  }, [onMessageReceived])

  return status
}

export default useWebSocket
