import { useState, useEffect } from 'preact/hooks';
import { Message } from '@/types';
import { cryptoService, messageService, uiService } from '@/services';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { TipsPanel } from './TipsPanel';
import { Notification } from './Notification';

/**
 * 主应用组件
 */
export function App() {
  const [isWechat, setIsWechat] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [copySuccessText, setCopySuccessText] = useState('已复制到剪贴板');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 初始化
  useEffect(() => {
    // 检测微信浏览器
    setIsWechat(uiService.detectWeChat());
    
    // 设置移动端适配
    if (!uiService.detectWeChat()) {
      uiService.setupMobileAdaptation();
    }
  }, []);

  // 滚动到底部
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (window.innerWidth <= 767) {
        uiService.forceScrollToBottom();
      } else {
        uiService.scrollToBottom();
      }
    });
  };

  // 处理加密
  const handleEncrypt = async () => {
    const text = inputText.trim();
    if (!text) return;

    setIsLoading(true);
    try {
      const encryptedText = await cryptoService.encrypt(text);
      const newMessage = messageService.createEncryptMessage(text, encryptedText);
      setMessages(prev => messageService.addMessage(prev, newMessage));
      setInputText('');
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('加密错误:', error);
      alert('加密失败: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理解密
  const handleDecrypt = async () => {
    setIsLoading(true);
    try {
      let textToDecrypt = '';
      
      // 优先使用输入框内容
      if (inputText.trim()) {
        textToDecrypt = inputText.trim();
      } else {
        // 尝试从剪贴板读取
        textToDecrypt = await uiService.readFromClipboard();
      }

      if (textToDecrypt) {
        const plaintext = await cryptoService.decrypt(textToDecrypt);
        const newMessage = messageService.createDecryptMessage(textToDecrypt, plaintext);
        setMessages(prev => messageService.addMessage(prev, newMessage));
        
        // 如果是从输入框获取的内容，清空输入框
        if (inputText.trim()) {
          setInputText('');
        }
        
        setTimeout(scrollToBottom, 100);
      } else {
        alert('没有找到要解密的文本，请输入或粘贴加密文本');
      }
    } catch (error) {
      console.error('解密错误:', error);
      alert('解密失败: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理复制成功
  const handleCopySuccess = (message: string) => {
    setCopySuccessText(message);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  // 切换提示
  const toggleTips = () => {
    setShowTips(!showTips);
  };

  // 微信浏览器警告
  if (isWechat) {
    return (
      <div className="container">
        <div className="wechat-warning">
          ⚠️ 检测到微信访问，请使用外部浏览器打开本页面
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="chat-container">
        <MessageList 
          messages={messages} 
          onCopySuccess={handleCopySuccess}
        />
      </div>

      <InputArea
        inputText={inputText}
        onInputChange={setInputText}
        onEncrypt={handleEncrypt}
        onDecrypt={handleDecrypt}
        onToggleTips={toggleTips}
        disabled={isLoading}
      />

      <TipsPanel
        show={showTips}
        onClose={toggleTips}
      />

      <Notification
        show={showCopySuccess}
        message={copySuccessText}
      />
    </div>
  );
} 