import { useState, useEffect } from 'preact/hooks';
import { Message } from '@/types';
import { cryptoService, messageService, uiService, themeService } from '@/services';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { TipsPanel } from './TipsPanel';
import { Notification } from './Notification';
import { quickDecrypt, quickEncrypt } from '@/utils/lz-unified-crypto';

// 开发环境测试数据
const createMockMessages = (): Message[] => {
  return [
    {
      id: 'mock-1',
      type: 'right',
      time: '10:30',
      content: [
        {
          type: 'original',
          text: '这是一条测试消息，用于调试样式效果。',
          label: '原始文本'
        },
        {
          type: 'encrypted',
          text: 'AES-GCM:U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y96Qsv2Lm+31cmzaAILwyt',
          label: '加密结果'
        }
      ]
    },
    {
      id: 'mock-2',
      type: 'left',
      time: '10:31',
      content: [
        {
          type: 'encrypted',
          text: 'AES-GCM:U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y96Qsv2Lm+31cmzaAILwyt',
          label: '收到的加密文本'
        },
        {
          type: 'decrypted',
          text: '这是一条解密后的消息，用于测试左侧气泡样式。',
          label: '解密结果'
        }
      ]
    },
    {
      id: 'mock-3',
      type: 'right',
      time: '10:32',
      content: [
        {
          type: 'original',
          text: '这是一条很长的测试消息，用于测试消息气泡在处理长文本时的样式效果。这条消息包含了多行文本，\n可以测试换行符的处理。\n\n还可以测试空行的处理效果。',
          label: '原始文本'
        },
        {
          type: 'encrypted',
          text: 'AES-GCM:U2FsdGVkX1+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          label: '加密结果'
        }
      ]
    },
    {
      id: 'mock-4',
      type: 'left',
      time: '10:33',
      content: [
        {
          type: 'encrypted',
          text: 'AES-GCM:U2FsdGVkX1+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          label: '收到的加密文本'
        },
        {
          type: 'decrypted',
          text: '这是一条包含特殊字符的解密消息：\n• 列表项 1\n• 列表项 2\n\n代码示例：\nfunction test() {\n  console.log("Hello World");\n}\n\n以及一些特殊符号：@#$%^&*()[]{}',
          label: '解密结果'
        }
      ]
    },
    {
      id: 'mock-5',
      type: 'right',
      time: '10:34',
      content: [
        {
          type: 'original',
          text: '短消息测试',
          label: '原始文本'
        },
        {
          type: 'encrypted',
          text: 'AES-GCM:U2FsdGVkX1+ShortMessage',
          label: '加密结果'
        }
      ]
    },
    {
      id: 'mock-6',
      type: 'left',
      time: '10:35',
      content: [
        {
          type: 'encrypted',
          text: 'AES-GCM:U2FsdGVkX1+ShortMessage',
          label: '收到的加密文本'
        },
        {
          type: 'decrypted',
          text: '简短回复',
          label: '解密结果'
        }
      ]
    }
  ];
};

/**
 * 主应用组件
 */
export function App() {
  const [isWechat, setIsWechat] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [copySuccessText, setCopySuccessText] = useState('已复制');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 初始化
  useEffect(() => {
    // 初始化主题系统
    themeService.init();
    
    // 检测微信浏览器
    setIsWechat(uiService.detectWeChat());
    
    // 临时测试代码 - 开发环境下可以通过URL参数强制显示微信警告
    if (import.meta.env.DEV && window.location.search.includes('test-wechat')) {
      setIsWechat(true);
    }
    
    // 设置移动端适配
    if (!uiService.detectWeChat()) {
      uiService.setupMobileAdaptation();
    }

    // 检查URL参数中的encrypt参数
    const urlParams = new URLSearchParams(window.location.search);
    const encryptParam = urlParams.get('encrypt');
    
    if (encryptParam) {
      try {
        const decryptedText = quickDecrypt(encryptParam);
        const newMessage = messageService.createDecryptMessage(encryptParam, decryptedText);
        setMessages([newMessage]);
        console.log('URL参数解密成功');
        
        // 清除URL参数（可选，避免刷新时重复处理）
        // const newUrl = window.location.origin + window.location.pathname;
        // window.history.replaceState({}, document.title, newUrl);
      } catch (error) {
        console.error('URL参数解密失败:', error);
        alert('URL参数解密失败: ' + (error as Error).message);
      }
    } else {
      // 只有在没有URL参数时才加载开发环境测试数据
      if (import.meta.env.DEV) {
        const mockMessages = createMockMessages();
        setMessages(mockMessages);
        console.log('开发环境：已加载测试数据');
      }
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
      // const encryptedText = await cryptoService.encrypt(text);
      const encryptedText = quickEncrypt(text);
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
        // 判断内容是不是网址，如果是网址，则进一步判断是否有encrypt参数,有的话，只解密encrypt后面的内容
        const isUrl = textToDecrypt.startsWith('http');
        if (isUrl) {
          const url = new URL(textToDecrypt);
          const encryptParam = url.searchParams.get('encrypt');
          if (encryptParam) {
            textToDecrypt = encryptParam;
          }
        }
        // 开始解密
        const plaintext = quickDecrypt(textToDecrypt);
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

  // 切换主题
  const toggleTheme = () => {
    themeService.toggle();
  };

  // 微信浏览器警告
  if (isWechat) {
    return (
      <div className="wechat-warning-container">
        <div className="wechat-warning-content">
          <div className="warning-icon">🚫</div>
          <h2>无法在微信中使用</h2>
          <p>请使用外部浏览器打开</p>
           
          <div className="usage-tip">
            <p>💡 <strong>如何使用：</strong></p>
            <ol>
              <li>点击右上角 <strong>「⋯」</strong> 菜单</li>
              <li>选择 <strong>「在浏览器中打开」</strong></li>
              <li>或复制链接到浏览器访问</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header-bar">
        <h1 className="app-title">文本加密工具</h1>
        <div className="header-actions">
          <button 
            className="header-btn" 
            onClick={toggleTips}
            disabled={isLoading}
            aria-label="帮助"
          >
            <i className="bi bi-question-circle-fill"></i>
          </button>
          
          <button 
            className="header-btn" 
            onClick={toggleTheme}
            disabled={isLoading}
            aria-label="切换主题"
          >
            <i className="bi bi-moon-fill"></i>
          </button>
        </div>
      </div>
      
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