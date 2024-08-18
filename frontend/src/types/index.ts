export interface MessageFile {
  file_id: number
  file_type: string
  file_size: number
  file_name: string
  file_original_name: string
}

export interface Message {
  message_id: number
  message_creation_time: string
  message_text: string | null
  message_files: MessageFile[]
}

export interface MessagesResponse {
  messages: Message[]
  hasMore: boolean
  nextCursor: string | null
}
