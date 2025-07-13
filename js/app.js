/**
 * 主应用逻辑
 * 使用模块化服务，简化的Alpine.js应用
 */

// Alpine.js 应用数据和方法
document.addEventListener('alpine:init', () => {
    
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
            // 强制重置messages数组为空
            this.messages = [];
            
            // 检测微信浏览器
            this.isWechat = UIService.detectWeChat();
            
            // 设置移动端适配
            UIService.setupMobileAdaptation();
        },
        
        // 添加测试消息方法
        addTestMessages() {
            console.log('添加测试消息...');
            
            // 测试消息1：短文本加密
            const testMessage1 = MessageService.createEncryptMessage(
                '测试消息1：这是一个短文本',
                'U2FsdGVkX1+8bQ1C4RHjvmqXzXjNkbCuJjE6QNqTl2M='
            );
            testMessage1.time = '09:30';
            this.messages.push(testMessage1);
            
            // 测试消息2：长文本加密
            const testMessage2 = MessageService.createEncryptMessage(
                '测试消息2：这是一个很长的文本消息，用于测试在移动端Safari和Chrome浏览器中的滚动行为是否正常。这条消息包含了足够多的文字内容，可以验证长文本在气泡中的显示效果和滚动性能。',
                'U2FsdGVkX1+vXZCHPgQ4S5Y8FjHyuKuNbQwRtL7qR9JZXnMCpqWtYvUiOmNbHjQwRtL7qR9JZXnMCpqWtYvUiOmNbHjQwRtL7qR9JZXnMCpqWtYvUiOmNbHj'
            );
            testMessage2.time = '09:31';
            this.messages.push(testMessage2);
            
            // 测试消息3：解密消息
            const testMessage3 = MessageService.createDecryptMessage(
                'U2FsdGVkX1+8bQ1C4RHjvmqXzXjNkbCuJjE6QNqTl2M=',
                '这是一个解密后的消息，用于测试左侧气泡的显示效果。'
            );
            testMessage3.time = '09:32';
            this.messages.push(testMessage3);
            
            // 测试消息4：包含换行的文本
            const testMessage4 = MessageService.createEncryptMessage(
                '测试消息4：\n包含换行符的文本\n第二行内容\n第三行内容\n用于测试换行显示',
                'U2FsdGVkX1+vXZCHPgQ4S5Y8FjHyuKuNbQwRtL7qR9JZXnMCpqWtYvUiOmNbHjQwRtL7qR9JZXnMCpqWtYvUiOmNbHjQwRtL7qR9JZXnMCpqWtYvUiOmNbHj'
            );
            testMessage4.time = '09:33';
            this.messages.push(testMessage4);
            
            // 测试消息5：长解密消息
            const testMessage5 = MessageService.createDecryptMessage(
                'U2FsdGVkX1+vXZCHPgQ4S5Y8FjHyuKuNbQwRtL7qR9JZXnMCpqWtYvUiOmNbHjQwRtL7qR9JZXnMCpqWtYvUiOmNbHjQwRtL7qR9JZXnMCpqWtYvUiOmNbHj',
                '这是一个很长的解密消息，用于测试在移动端浏览器中的滚动性能。这条消息的内容足够长，可以验证左侧气泡的滚动行为。当消息列表很长时，用户应该能够顺畅地滚动查看所有消息内容。'
            );
            testMessage5.time = '09:34';
            this.messages.push(testMessage5);
            
            // 测试消息6：更多右侧消息
            const testMessage6 = MessageService.createEncryptMessage(
                '测试消息6：继续添加更多消息以测试滚动',
                'U2FsdGVkX1+8bQ1C4RHjvmqXzXjNkbCuJjE6QNqTl2M='
            );
            testMessage6.time = '09:35';
            this.messages.push(testMessage6);
            
            // 测试消息7：特殊字符
            const testMessage7 = MessageService.createEncryptMessage(
                '测试消息7：包含特殊字符 🔒🔓💡⚡🌟 和 emoji 表情',
                'U2FsdGVkX1+vXZCHPgQ4S5Y8FjHyuKuNbQwRtL7qR9JZXnMCpqWtYvUiOmNbHjQwRtL7qR9JZXnMCpqWtYvUiOmNbHjQwRtL7qR9JZXnMCpqWtYvUiOmNbHj'
            );
            testMessage7.time = '09:36';
            this.messages.push(testMessage7);
            
            // 测试消息8：最后一条消息
            const testMessage8 = MessageService.createDecryptMessage(
                'U2FsdGVkX1+8bQ1C4RHjvmqXzXjNkbCuJjE6QNqTl2M=',
                '这是最后一条测试消息，用于验证滚动到底部的功能是否正常工作。'
            );
            testMessage8.time = '09:37';
            this.messages.push(testMessage8);
            
            console.log('测试消息添加完成，共', this.messages.length, '条消息');
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
                // 使用加密服务加密文本
                const encryptedText = await CryptoService.encrypt(text);
                
                // 使用消息服务创建消息对象
                const newMessage = MessageService.createEncryptMessage(text, encryptedText);
                
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
                
            } catch (error) {
                console.error('加密错误:', error);
                alert('加密失败: ' + error.message);
            }
        },
        
        // 粘贴并解密
        async pasteAndDecrypt() {
            try {
                let textToDecrypt = '';
                
                // 优先使用输入框内容
                if (this.inputText.trim()) {
                    textToDecrypt = this.inputText.trim();
                } else {
                    // 尝试从剪贴板读取
                    textToDecrypt = await UIService.readFromClipboard();
                }
                
                if (textToDecrypt) {
                    // 使用加密服务解密
                    const plaintext = await CryptoService.decrypt(textToDecrypt);
                    
                    // 使用消息服务创建解密消息
                    const newMessage = MessageService.createDecryptMessage(textToDecrypt, plaintext);
                    
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