/**
 * 基于lz-string压缩 + 凯撒加密的方案
 * 不介意短文本压缩率，只介意长文本压缩率
 * 可以在url中传播
 */

import LZString from "lz-string"

// URL安全字符：A-Z(26) + a-z(26) + 0-9(10) + -_.~(4) = 66个字符
const urlSafeChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~"

export class LZUnifiedCrypto {
    private readonly shift: number

    constructor(key: string = "hair") {
        // 将key转换为凯撒加密的偏移量
        this.shift = this.generateShift(key)
    }

    private generateShift(key: string): number {
        let sum = 0
        for (let i = 0; i < key.length; i++) {
            sum += key.charCodeAt(i)
        }
        // 避免0偏移
        return (sum % (urlSafeChars.length - 1)) + 1
    }

    /**
     * 凯撒加密 - 在URL安全字符范围内偏移
     */
    private caesarEncrypt(text: string): string {
        return text
            .split("")
            .map((char) => {
                const index = urlSafeChars.indexOf(char)
                if (index !== -1) {
                    // 在URL安全字符范围内偏移
                    const newIndex = (index + this.shift) % urlSafeChars.length
                    return urlSafeChars[newIndex]
                }
                // 非URL安全字符保持不变（理论上不应该出现）
                return char
            })
            .join("")
    }

    /**
     * 凯撒解密 - 在URL安全字符范围内反向偏移
     */
    private caesarDecrypt(text: string): string {
        return text
            .split("")
            .map((char) => {
                const index = urlSafeChars.indexOf(char)
                if (index !== -1) {
                    // 在URL安全字符范围内反向偏移
                    const newIndex =
                        (index - this.shift + urlSafeChars.length) %
                        urlSafeChars.length
                    return urlSafeChars[newIndex]
                }
                // 非URL安全字符保持不变
                return char
            })
            .join("")
    }

    /**
     * 加密：压缩 → 凯撒加密
     */
    encrypt(text: string): string {
        // 1. 先压缩
        const compressed = LZString.compressToEncodedURIComponent(text)

        if (!compressed) {
            throw new Error("压缩失败")
        }

        // 2. 再凯撒加密
        return this.caesarEncrypt(compressed)
    }

    /**
     * 解密：凯撒解密 → 解压
     */
    decrypt(encryptedText: string): string {
        if (!encryptedText) {
            throw new Error("无效的加密文本")
        }

        // 1. 先凯撒解密
        const decrypted = this.caesarDecrypt(encryptedText)

        // 2. 再解压
        const decompressed =
            LZString.decompressFromEncodedURIComponent(decrypted)

        if (!decompressed) {
            throw new Error("解压失败")
        }

        return decompressed
    }

    /**
     * 分析压缩效果
     */
    analyze(text: string): {
        originalLength: number
        compressedLength: number
        ratio: number
    } {
        const compressed = this.encrypt(text)

        return {
            originalLength: text.length,
            compressedLength: compressed.length,
            ratio: Math.round((compressed.length / text.length) * 100),
        }
    }

    /**
     * 批量处理
     */
    encryptBatch(texts: string[]): string[] {
        return texts.map((text) => this.encrypt(text))
    }

    decryptBatch(encryptedTexts: string[]): string[] {
        return encryptedTexts.map((text) => this.decrypt(text))
    }
}

// 导出便捷函数

export const quickEncrypt = (text: string, key?: string) => {
    const crypto = key ? new LZUnifiedCrypto(key) : new LZUnifiedCrypto()
    return crypto.encrypt(text)
}

export const quickDecrypt = (encrypted: string, key?: string) => {
    const crypto = key ? new LZUnifiedCrypto(key) : new LZUnifiedCrypto()
    return crypto.decrypt(encrypted)
}

// 测试
// const original = `https://www.abc.com/watch?v=dQw4w9WgXcQ`
// const encrypted = quickEncrypt(original)
// const decrypted = quickDecrypt(encrypted)
// console.log({ original, encrypted, decrypted })
// const analyze = new LZUnifiedCrypto()
// console.log(analyze.analyze(original))
