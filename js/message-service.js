/**
 * 消息管理服务模块
 * 负责消息的创建、验证、存储和管理
 */
window.MessageService = {
    
    /**
     * 验证消息对象是否有效
     * @param {Object} message 要验证的消息对象
     * @returns {boolean} 是否有效
     */
    validate(message) {
        return message && 
               message.id && 
               message.type && 
               message.time && 
               Array.isArray(message.content) && 
               message.content.length >= 2 &&
               message.content.every(item => item && item.type && item.text && item.label);
    },
    
    /**
     * 创建加密消息对象
     * @param {string} originalText 原始文本
     * @param {string} encryptedText 加密后的文本
     * @returns {Object} 消息对象
     */
    createEncryptMessage(originalText, encryptedText) {
        return {
            id: this.generateUniqueId(),
            type: 'right', // 右侧气泡 - 发送的加密消息
            time: this.getCurrentTime(),
            content: [
                {
                    type: 'original',
                    text: originalText,
                    label: '原始文本'
                },
                {
                    type: 'encrypted',
                    text: encryptedText,
                    label: '加密结果'
                }
            ]
        };
    },
    
    /**
     * 创建解密消息对象
     * @param {string} ciphertext 密文
     * @param {string} plaintext 解密后的明文
     * @returns {Object} 消息对象
     */
    createDecryptMessage(ciphertext, plaintext) {
        return {
            id: this.generateUniqueId(),
            type: 'left', // 左侧气泡 - 接收的解密消息
            time: this.getCurrentTime(),
            content: [
                {
                    type: 'encrypted',
                    text: ciphertext,
                    label: '收到的加密文本'
                },
                {
                    type: 'decrypted',
                    text: plaintext,
                    label: '解密结果'
                }
            ]
        };
    },
    
    /**
     * 安全地添加消息到消息列表
     * @param {Array} messages 消息数组
     * @param {Object} message 要添加的消息
     * @returns {Array} 更新后的消息数组
     */
    addMessage(messages, message) {
        if (!this.validate(message)) {
            console.error('消息验证失败，拒绝添加:', message);
            return messages;
        }
        
        console.log('添加消息:', message.id, message.type);
        return [...messages, message];
    },
    
    /**
     * 过滤出有效的消息
     * @param {Array} messages 消息数组
     * @returns {Array} 过滤后的有效消息数组
     */
    filterValidMessages(messages) {
        return messages.filter(m => this.validate(m));
    },
    
    /**
     * 生成唯一ID
     * @returns {string} 唯一标识符
     */
    generateUniqueId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * 获取当前时间格式化字符串
     * @returns {string} 格式化的时间字符串 (HH:MM)
     */
    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}; 