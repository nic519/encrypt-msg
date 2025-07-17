/**
 * 复制加密后的内容
 * @param text
 * @returns
 */
export const copyEncryptedContent = (text: string) => {
    const url = window.location.origin + window.location.pathname
    const encryptedText = text
    const encryptedUrl = `${url}?x=${encryptedText}`
    return encryptedUrl
}
