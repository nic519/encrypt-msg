import { IMessageService, Message, MessageContent } from "@/types"

/**
 * 消息管理服务类
 * 负责消息的创建、验证、存储和管理
 */
export class MessageService implements IMessageService {
    /**
     * 验证消息对象是否有效
     * @param message 要验证的消息对象
     * @returns 是否有效
     */
    validate(message: Message): boolean {
        return !!(
            message &&
            message.id &&
            message.type &&
            message.time &&
            Array.isArray(message.content) &&
            message.content.length >= 2 &&
            message.content.every(
                (item) => item && item.type && item.text && item.label
            )
        )
    }

    /**
     * 创建加密消息对象
     * @param originalText 原始文本
     * @param encryptedText 加密后的文本
     * @returns 消息对象
     */
    createEncryptMessage(originalText: string, encryptedText: string): Message {
        return {
            id: this.generateUniqueId(),
            type: "right", // 右侧气泡 - 发送的加密消息
            time: this.getCurrentTime(),
            content: [
                {
                    type: "original",
                    text: originalText,
                    label: "原始文本",
                },
                {
                    type: "encrypted",
                    text: encryptedText,
                    label: "加密结果",
                },
            ] as MessageContent[],
        }
    }

    /**
     * 创建解密消息对象
     * @param ciphertext 密文
     * @param plaintext 解密后的明文
     * @returns 消息对象
     */
    createDecryptMessage(ciphertext: string, plaintext: string): Message {
        return {
            id: this.generateUniqueId(),
            type: "left", // 左侧气泡 - 接收的解密消息
            time: this.getCurrentTime(),
            content: [
                {
                    type: "encrypted",
                    text: ciphertext,
                    label: "收到的加密文本",
                },
                {
                    type: "decrypted",
                    text: plaintext,
                    label: "解密结果",
                },
            ] as MessageContent[],
        }
    }

    /**
     * 安全地添加消息到消息列表
     * @param messages 消息数组
     * @param message 要添加的消息
     * @returns 更新后的消息数组
     */
    addMessage(messages: Message[], message: Message): Message[] {
        if (!this.validate(message)) {
            console.error("消息验证失败，拒绝添加:", message)
            return messages
        }

        return [...messages, message]
    }

    /**
     * 过滤出有效的消息
     * @param messages 消息数组
     * @returns 过滤后的有效消息数组
     */
    filterValidMessages(messages: Message[]): Message[] {
        return messages.filter((m) => this.validate(m))
    }

    /**
     * 生成唯一ID
     * @returns 唯一标识符
     */
    generateUniqueId(): string {
        return (
            "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
        )
    }

    /**
     * 获取当前时间格式化字符串
     * @returns 格式化的时间字符串 (HH:MM)
     */
    getCurrentTime(): string {
        const now = new Date()
        const hours = now.getHours().toString().padStart(2, "0")
        const minutes = now.getMinutes().toString().padStart(2, "0")
        return `${hours}:${minutes}`
    }
}

// 导出单例实例
export const messageService = new MessageService()
