import { Message } from "./message"

/**
 * 应用状态接口
 */
export interface AppState {
    isWechat: boolean
    inputText: string
    showTips: boolean
    showCopySuccess: boolean
    copySuccessText: string
    messages: Message[]
}

/**
 * 复制结果类型
 */
export interface CopyResult {
    success: boolean
    message?: string
}

/**
 * 加密/解密结果类型
 */
export interface CryptoResult {
    success: boolean
    data?: string
    error?: string
}

/**
 * 通知配置
 */
export interface NotificationConfig {
    message: string
    duration: number
    type?: "success" | "error" | "warning"
}
