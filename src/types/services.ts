import { Message } from "./message"

/**
 * 加密服务接口
 */
export interface ICryptoService {
    encrypt(plaintext: string): Promise<string>
    decrypt(ciphertext: string): Promise<string>
}

/**
 * 消息服务接口
 */
export interface IMessageService {
    validate(message: Message): boolean
    createEncryptMessage(originalText: string, encryptedText: string): Message
    createDecryptMessage(ciphertext: string, plaintext: string): Message
    addMessage(messages: Message[], message: Message): Message[]
    filterValidMessages(messages: Message[]): Message[]
    generateUniqueId(): string
    getCurrentTime(): string
}

/**
 * UI服务接口
 */
export interface IUIService {
    copyToClipboard(text: string): Promise<void>
    scrollToBottom(): void
    detectWeChat(): boolean
    setupMobileAdaptation(): void
    readFromClipboard(): Promise<string>
    showNotification(message: string, duration?: number): void
}
