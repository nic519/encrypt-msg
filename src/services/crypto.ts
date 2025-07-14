import { ICryptoService } from "@/types"

/**
 * 加密服务类
 * 负责文本的加密和解密功能
 */
export class CryptoService implements ICryptoService {
    /**
     * 加密文本
     * @param plaintext 要加密的明文
     * @returns 加密后的Base64字符串
     */
    async encrypt(plaintext: string): Promise<string> {
        if (!plaintext) {
            throw new Error("请输入要加密的文本")
        }

        try {
            const encoder = new TextEncoder()
            const data = encoder.encode(plaintext)

            // 生成随机密钥和IV
            const key = await crypto.subtle.generateKey(
                {
                    name: "AES-GCM",
                    length: 256,
                },
                true,
                ["encrypt", "decrypt"]
            )
            const iv = crypto.getRandomValues(new Uint8Array(12))

            // 加密数据
            const encryptedData = await crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                key,
                data
            )

            // 导出密钥
            const exportedKey = await crypto.subtle.exportKey("raw", key)
            const keyArray = new Uint8Array(exportedKey)

            // 组合IV、密钥和加密数据
            const encryptedArray = new Uint8Array(encryptedData)
            const resultArray = new Uint8Array(
                iv.length + keyArray.length + encryptedArray.length
            )
            resultArray.set(iv)
            resultArray.set(keyArray, iv.length)
            resultArray.set(encryptedArray, iv.length + keyArray.length)

            // 转换为Base64
            return btoa(String.fromCharCode.apply(null, [...resultArray]))
        } catch (error) {
            console.error("加密过程中出错:", error)
            throw new Error("加密失败：" + (error as Error).message)
        }
    }

    /**
     * 解密文本
     * @param ciphertext 要解密的密文
     * @returns 解密后的明文
     */
    async decrypt(ciphertext: string): Promise<string> {
        if (!ciphertext) {
            throw new Error("请输入要解密的文本")
        }

        try {
            // 从Base64解码
            let decodedData: string
            try {
                decodedData = atob(ciphertext)
            } catch (e) {
                throw new Error("无效的加密文本格式")
            }

            const encryptedData = Uint8Array.from(decodedData, (c) =>
                c.charCodeAt(0)
            )

            // 提取IV、密钥和加密数据
            const iv = encryptedData.slice(0, 12)
            const keyData = encryptedData.slice(12, 44) // AES-256密钥长度为32字节
            const data = encryptedData.slice(44)

            // 导入密钥
            const key = await crypto.subtle.importKey(
                "raw",
                keyData,
                {
                    name: "AES-GCM",
                    length: 256,
                },
                false,
                ["decrypt"]
            )

            // 解密数据
            const decryptedData = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                key,
                data
            )

            // 转换为文本
            const decoder = new TextDecoder()
            return decoder.decode(decryptedData)
        } catch (error) {
            console.error("解密过程中出错:", error)
            throw new Error("解密失败：" + (error as Error).message)
        }
    }
}

// 导出单例实例
export const cryptoService = new CryptoService()
