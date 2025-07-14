/**
 * 消息内容类型
 */
export interface MessageContent {
    type: "original" | "encrypted" | "decrypted"
    text: string
    label: string
}

/**
 * 消息类型
 */
export interface Message {
    id: string
    type: "left" | "right"
    time: string
    content: MessageContent[]
}

/**
 * 消息气泡类型
 */
export type MessageBubbleType = "left" | "right"

/**
 * 消息验证函数类型
 */
export type MessageValidator = (message: Message) => boolean
