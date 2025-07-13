/**
 * 主应用逻辑
 * 使用模块化服务，简化的Alpine.js应用
 */

// 添加调试信息
console.log('应用模块加载中...');

// 确保DOM加载完成后再初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载完成，等待Alpine初始化...');
});

// Alpine.js 应用数据和方法
document.addEventListener('alpine:init', () => {
    console.log('Alpine初始化事件触发...');
    
    Alpine.data('encryptApp', () => ({
        // 响应式状态
        isWechat: false,
        inputText: '',
        showTips: false,
        showCopySuccess: false,
        copySuccessText: '已复制到剪贴板',
        messages: [],
        
        // 初始化
        init() {
            console.log('加密应用初始化中...');
            
            // 强制重置messages数组为空
            this.messages = [];
            
            // 检测微信浏览器
            this.isWechat = UIService.detectWeChat();
            
            // 设置移动端适配
            UIService.setupMobileAdaptation();
            
            console.log('应用已初始化，messages数组长度:', this.messages.length);
        },
        
        // 清空文本输入
        clearText() {
            this.inputText = '';
            document.getElementById('message-input').focus();
        },
        
        // 切换帮助提示显示
        toggleTips() {
            this.showTips = !this.showTips;
        },
        
        // 处理加密消息
        async processMessage() {
            const text = this.inputText.trim();
            if (!text) return;
            
            try {
                console.log('开始加密文本:', text);
                
                // 使用加密服务加密文本
                const encryptedText = await CryptoService.encrypt(text);
                console.log('加密成功');
                
                // 使用消息服务创建消息对象
                const newMessage = MessageService.createEncryptMessage(text, encryptedText);
                console.log('创建加密消息对象:', newMessage.id);
                
                // 添加消息到列表
                this.messages = MessageService.addMessage(this.messages, newMessage);
                
                // 清空输入框
                this.inputText = '';
                
                // 滚动到底部
                this.$nextTick(() => {
                    if (window.innerWidth <= 767) {
                        // 移动端使用强制滚动
                        UIService.forceScrollToBottom();
                    } else {
                        UIService.scrollToBottom();
                    }
                });
                
                console.log('加密消息处理完成');
                
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
                
                // 优先使用输入框内容
                if (this.inputText.trim()) {
                    console.log('使用输入框内容进行解密');
                    textToDecrypt = this.inputText.trim();
                } else {
                    // 尝试从剪贴板读取
                    console.log('尝试从剪贴板读取内容');
                    textToDecrypt = await UIService.readFromClipboard();
                    console.log('从剪贴板获取内容成功');
                }
                
                if (textToDecrypt) {
                    // 使用加密服务解密
                    console.log('开始解密文本');
                    const plaintext = await CryptoService.decrypt(textToDecrypt);
                    console.log('解密成功');
                    
                    // 使用消息服务创建解密消息
                    const newMessage = MessageService.createDecryptMessage(textToDecrypt, plaintext);
                    console.log('创建解密消息对象:', newMessage.id);
                    
                    // 添加消息到列表
                    this.messages = MessageService.addMessage(this.messages, newMessage);
                    
                    // 如果是从输入框获取的内容，清空输入框
                    if (this.inputText.trim()) {
                        this.inputText = '';
                    }
                    
                    // 滚动到底部
                    this.$nextTick(() => {
                        if (window.innerWidth <= 767) {
                            // 移动端使用强制滚动
                            UIService.forceScrollToBottom();
                        } else {
                            UIService.scrollToBottom();
                        }
                    });
                    
                    console.log('解密消息处理完成');
                } else {
                    alert('没有找到要解密的文本，请输入或粘贴加密文本');
                }
            } catch (error) {
                console.error('解密错误:', error);
                alert('解密失败: ' + error.message);
            }
        },
        
        // 复制消息内容
        async copyMessageContent(content, event) {
            try {
                // 使用UI服务复制到剪贴板
                await UIService.copyToClipboard(content);
                console.log('内容已复制到剪贴板');
                
                // 更新按钮状态
                UIService.updateCopyButtonState(event);
                
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
        
        // 获取过滤后的有效消息
        getValidMessages() {
            return MessageService.filterValidMessages(this.messages);
        }
    }));
}); 