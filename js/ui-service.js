/**
 * UI服务模块
 * 负责用户界面交互、复制功能、移动端适配等
 */
window.UIService = {
    
    /**
     * 复制文本到剪贴板
     * @param {string} text 要复制的文本
     * @returns {Promise<void>}
     */
    async copyToClipboard(text) {
        try {
            // 方法1: 使用现代 Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return;
            }
            
            // 方法2: 创建临时元素并执行复制命令
            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // 确保元素不可见
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            
            textArea.focus();
            textArea.select();
            
            // 执行复制命令
            const success = document.execCommand('copy');
            textArea.remove();
            
            if (!success) {
                throw new Error('复制命令执行失败');
            }
        } catch (error) {
            throw error;
        }
    },
    
    /**
     * 处理复制按钮的状态更新
     * @param {Event} event 点击事件
     * @param {string} successMessage 成功提示文本
     */
    updateCopyButtonState(event, successMessage = '已复制') {
        const button = event.target.closest('.message-copy-btn');
        if (!button) return;
        
        button.classList.add('copied');
        const textSpan = button.querySelector('span:not(.copy-icon)');
        if (textSpan) textSpan.textContent = successMessage;
        
        setTimeout(() => {
            button.classList.remove('copied');
            if (textSpan) textSpan.textContent = '复制';
        }, 2000);
    },
    
    /**
     * 滚动消息容器到底部
     */
    scrollToBottom() {
        const messagesContainer = document.getElementById('messages-area');
        if (messagesContainer) {
            // 延迟执行，确保DOM更新完成
            setTimeout(() => {
                // 强制滚动到底部，并确保有足够的偏移量
                const scrollHeight = messagesContainer.scrollHeight;
                const clientHeight = messagesContainer.clientHeight;
                const maxScrollTop = scrollHeight - clientHeight;
                
                // 在移动端添加额外的偏移量，确保完全显示
                const extraOffset = window.innerWidth <= 767 ? 20 : 0;
                messagesContainer.scrollTop = maxScrollTop + extraOffset;
                
                // 使用smooth行为的备用方案
                messagesContainer.scrollTo({
                    top: maxScrollTop + extraOffset,
                    behavior: 'smooth'
                });
            }, 100);
        }
    },
    
    /**
     * 检测是否在微信浏览器中
     * @returns {boolean} 是否为微信浏览器
     */
    detectWeChat() {
        const ua = navigator.userAgent.toLowerCase();
        return ua.includes('micromessenger');
    },
    
    /**
     * 设置移动端适配
     */
    setupMobileAdaptation() {
        // 处理输入框高度自适应
        const messageInput = document.getElementById('message-input');
        if (!messageInput) return;
        
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            const maxHeight = 80; // 最大高度
            const newHeight = Math.min(this.scrollHeight, maxHeight);
            this.style.height = newHeight + 'px';
        });
        
        // 简化窗口大小变化处理
        window.addEventListener('resize', () => {
            this.adjustMessageAreaPadding();
        });
        
        // 初始调整
        this.adjustMessageAreaPadding();
        
        // 简化输入框焦点处理，移除可能有问题的window.scrollTo
        messageInput.addEventListener('focus', () => {
            setTimeout(() => {
                this.adjustMessageAreaPadding();
                if (window.innerWidth <= 767) {
                    this.scrollToBottom();
                }
            }, 100);
        });
    },
    
    /**
     * 调整消息区域的底部内边距，确保所有消息都可见
     */
    adjustMessageAreaPadding() {
        const messagesArea = document.getElementById('messages-area');
        const inputArea = document.querySelector('.input-area');
        
        if (messagesArea && inputArea && window.innerWidth <= 767) {
            const inputAreaHeight = inputArea.offsetHeight;
            
            // 统一使用合理的安全边距
            const extraPadding = 50;
            const totalPadding = inputAreaHeight + extraPadding;
            
            // 设置足够的底部间距
            messagesArea.style.paddingBottom = totalPadding + 'px';
        }
    },

    /**
     * 强制滚动到最底部 - 简化版本
     */
    forceScrollToBottom() {
        const messagesContainer = document.getElementById('messages-area');
        if (messagesContainer && window.innerWidth <= 767) {
            // 先调整间距
            this.adjustMessageAreaPadding();
            
            // 使用统一的滚动逻辑
            setTimeout(() => {
                const scrollHeight = messagesContainer.scrollHeight;
                messagesContainer.scrollTop = scrollHeight;
                
                // 备用方法：使用scrollTo
                messagesContainer.scrollTo({
                    top: scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    },
    
    /**
     * 从剪贴板读取文本
     * @returns {Promise<string>} 剪贴板中的文本
     */
    async readFromClipboard() {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                return await navigator.clipboard.readText();
            }
            throw new Error('剪贴板API不可用');
        } catch (error) {
            console.warn('读取剪贴板失败:', error);
            throw new Error('无法读取剪贴板内容');
        }
    },
    
    /**
     * 显示通知消息
     * @param {string} message 通知内容
     * @param {number} duration 显示时长（毫秒）
     */
    showNotification(message, duration = 2000) {
        // 这个方法可以被Alpine.js的响应式系统调用
        return { message, duration };
    }
}; 