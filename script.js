// 添加调试信息
console.log('脚本加载中...');

// 确保DOM加载完成后再初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载完成，等待Alpine初始化...');
});

// Alpine.js 应用数据和方法
document.addEventListener('alpine:init', () => {
    console.log('Alpine初始化事件触发...');
    Alpine.data('encryptApp', () => ({
        isWechat: false,
        inputText: '',
        showTips: false,
        showCopySuccess: false,
        copySuccessText: '已复制到剪贴板',
        messages: [], // 存储所有消息
        
        // 初始化
        init() {
            console.log('encryptApp组件初始化中...');
            
            // 强制重置messages数组为空
            this.messages = [];
            
            this.detectWeChat();
            this.setupMobileAdaptation();
            
            // 调试信息
            console.log('应用已初始化，messages数组长度:', this.messages.length);
        },
        
        // 检测微信浏览器
        detectWeChat() {
            const ua = navigator.userAgent.toLowerCase();
            this.isWechat = ua.includes('micromessenger');
        },
        

        
        // 清空文本
        clearText() {
            this.inputText = '';
            document.getElementById('message-input').focus();
        },
        
        // 切换提示区域的显示和隐藏
        toggleTips() {
            this.showTips = !this.showTips;
        },
        
        // 验证消息对象是否有效
        validateMessage(message) {
            return message && 
                   message.id && 
                   message.type && 
                   message.time && 
                   Array.isArray(message.content) && 
                   message.content.length >= 2 &&
                   message.content.every(item => item && item.type && item.text && item.label);
        },
        
        // 安全地添加消息到数组
        addMessage(message) {
            if (!this.validateMessage(message)) {
                console.error('消息验证失败，拒绝添加:', message);
                return false;
            }
            
            console.log('添加消息:', message.id, message.type);
            
            // 创建新数组来确保响应式更新
            const newMessages = [...this.messages, message];
            this.messages = newMessages;
            
            console.log('消息添加成功，当前消息数量:', this.messages.length);
            
            // 滚动到底部
            this.$nextTick(() => {
                this.scrollToBottom();
                
                // 验证DOM是否更新
                const messageElement = document.getElementById(message.id);
                console.log('消息DOM元素存在:', messageElement ? true : false);
            });
            
            return true;
        },
        
        // 处理用户输入的消息
        async processMessage() {
            const text = this.inputText.trim();
            if (!text) return;
            
            try {
                console.log('开始加密文本:', text);
                
                // 加密文本
                const encryptedText = await this.encryptText(text);
                console.log('加密成功:', encryptedText.substring(0, 20) + '...');
                
                // 创建新消息对象
                const newMessage = {
                    id: this.generateUniqueId(),
                    type: 'right', // 右侧气泡 - 发送的加密消息
                    time: this.getCurrentTime(),
                    content: [
                        {
                            type: 'original',
                            text: text,
                            label: '原始文本'
                        },
                        {
                            type: 'encrypted',
                            text: encryptedText,
                            label: '加密结果'
                        }
                    ]
                };
                
                console.log('创建加密消息对象:', newMessage.id);
                
                // 安全地添加消息
                if (this.addMessage(newMessage)) {
                    // 清空输入框
                    this.inputText = '';
                    console.log('加密消息处理完成');
                } else {
                    console.error('加密消息添加失败');
                }
                
            } catch (error) {
                console.error('加密错误:', error);
                alert('加密失败: ' + error.message);
            }
        },
        
        // 粘贴并解密
        async pasteAndDecrypt() {
            console.log('尝试解密...');
            
            try {
                let textToDecrypt = '';
                
                // 如果输入框有内容，优先使用输入框内容
                if (this.inputText.trim()) {
                    console.log('使用输入框内容进行解密');
                    textToDecrypt = this.inputText.trim();
                } else {
                    // 尝试从剪贴板读取文本
                    console.log('尝试从剪贴板读取内容');
                    textToDecrypt = await navigator.clipboard.readText();
                    console.log('从剪贴板获取内容成功');
                }
                
                if (textToDecrypt) {
                    // 执行解密
                    console.log('开始解密文本');
                    const plaintext = await this.decryptText(textToDecrypt);
                    console.log('解密成功');
                    this.addDecryptMessage(textToDecrypt, plaintext);
                    
                    // 如果是从输入框获取的内容，清空输入框
                    if (this.inputText.trim()) {
                        this.inputText = '';
                    }
                } else {
                    alert('没有找到要解密的文本，请输入或粘贴加密文本');
                }
            } catch (error) {
                console.error('解密错误:', error);
                alert('解密失败: ' + error.message);
            }
        },
        
        // 添加解密消息
        addDecryptMessage(ciphertext, plaintext) {
            console.log('添加解密消息');
            
            // 创建新消息对象
            const newMessage = {
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
            
            console.log('创建解密消息对象:', newMessage.id);
            
            // 安全地添加消息
            if (this.addMessage(newMessage)) {
                console.log('解密消息处理完成');
            } else {
                console.error('解密消息添加失败');
            }
        },
        
        // 复制消息内容
        async copyMessageContent(content, event) {
            try {
                await this.copyToClipboard(content);
                console.log('内容已复制到剪贴板');
                
                // 更新按钮状态
                const button = event.target.closest('.message-copy-btn');
                if (button) {
                    button.classList.add('copied');
                    const textSpan = button.querySelector('span:not(.copy-icon)');
                    if (textSpan) textSpan.textContent = '已复制';
                    
                    setTimeout(() => {
                        button.classList.remove('copied');
                        if (textSpan) textSpan.textContent = '复制';
                    }, 2000);
                }
                
                // 显示复制成功提示
                this.copySuccessText = '已复制到剪贴板';
                this.showCopySuccess = true;
                setTimeout(() => {
                    this.showCopySuccess = false;
                }, 2000);
                
            } catch (error) {
                console.error('复制失败:', error);
                alert('复制失败，请手动复制');
            }
        },
        
        // 复制到剪贴板
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
        
        // 滚动到底部
        scrollToBottom() {
            const messagesContainer = document.getElementById('messages-area');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        },
        
        // 移动端适配
        setupMobileAdaptation() {
            // 处理输入框高度自适应
            const messageInput = document.getElementById('message-input');
            if (messageInput) {
                messageInput.addEventListener('input', function() {
                    this.style.height = 'auto';
                    const maxHeight = 80; // 最大高度
                    const newHeight = Math.min(this.scrollHeight, maxHeight);
                    this.style.height = newHeight + 'px';
                });
                
                // 监听窗口大小变化，调整消息区域的底部内边距
                window.addEventListener('resize', () => this.adjustMessageAreaPadding());
                // 初始调整
                this.adjustMessageAreaPadding();
                
                // 处理输入框焦点问题
                messageInput.addEventListener('focus', function() {
                    // 在iOS上，当输入框获取焦点时，滚动到页面底部
                    setTimeout(function() {
                        window.scrollTo(0, document.body.scrollHeight);
                    }, 300);
                });
            }
        },
        
        // 调整消息区域的底部内边距，确保所有消息都可见
        adjustMessageAreaPadding() {
            const messagesArea = document.getElementById('messages-area');
            const inputArea = document.querySelector('.input-area');
            
            if (messagesArea && inputArea && window.innerWidth <= 767) {
                const inputAreaHeight = inputArea.offsetHeight;
                messagesArea.style.paddingBottom = (inputAreaHeight + 20) + 'px';
            }
        },
        
        // 获取当前时间格式化字符串
        getCurrentTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        },
        
        // 生成唯一ID
        generateUniqueId() {
            return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },
        
        // 加密文本
        async encryptText(plaintext) {
            if (!plaintext) {
                throw new Error('请输入要加密的文本');
            }
            
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(plaintext);
                
                // 生成随机密钥和IV
                const key = await window.crypto.subtle.generateKey(
                    {
                        name: 'AES-GCM',
                        length: 256
                    },
                    true,
                    ['encrypt', 'decrypt']
                );
                const iv = window.crypto.getRandomValues(new Uint8Array(12));
                
                // 加密数据
                const encryptedData = await window.crypto.subtle.encrypt(
                    {
                        name: 'AES-GCM',
                        iv: iv
                    },
                    key,
                    data
                );
                
                // 导出密钥
                const exportedKey = await window.crypto.subtle.exportKey('raw', key);
                const keyArray = new Uint8Array(exportedKey);
                
                // 组合IV、密钥和加密数据
                const encryptedArray = new Uint8Array(encryptedData);
                const resultArray = new Uint8Array(iv.length + keyArray.length + encryptedArray.length);
                resultArray.set(iv);
                resultArray.set(keyArray, iv.length);
                resultArray.set(encryptedArray, iv.length + keyArray.length);
                
                // 转换为Base64
                return btoa(String.fromCharCode.apply(null, [...resultArray]));
                
            } catch (error) {
                console.error('加密过程中出错:', error);
                throw new Error('加密失败：' + error.message);
            }
        },
        
        // 解密文本
        async decryptText(ciphertext) {
            if (!ciphertext) {
                throw new Error('请输入要解密的文本');
            }
            
            try {
                // 从Base64解码
                let decodedData;
                try {
                    decodedData = atob(ciphertext);
                } catch (e) {
                    throw new Error('无效的加密文本格式');
                }
                
                const encryptedData = Uint8Array.from(decodedData, c => c.charCodeAt(0));
                
                // 提取IV、密钥和加密数据
                const iv = encryptedData.slice(0, 12);
                const keyData = encryptedData.slice(12, 44); // AES-256密钥长度为32字节
                const data = encryptedData.slice(44);
                
                // 导入密钥
                const key = await window.crypto.subtle.importKey(
                    'raw',
                    keyData,
                    {
                        name: 'AES-GCM',
                        length: 256
                    },
                    false,
                    ['decrypt']
                );
                
                // 解密数据
                const decryptedData = await window.crypto.subtle.decrypt(
                    {
                        name: 'AES-GCM',
                        iv: iv
                    },
                    key,
                    data
                );
                
                // 转换为文本
                const decoder = new TextDecoder();
                return decoder.decode(decryptedData);
                
            } catch (error) {
                console.error('解密过程中出错:', error);
                throw new Error('解密失败：' + error.message);
            }
        }
    }));
}); 