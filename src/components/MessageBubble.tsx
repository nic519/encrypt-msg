import { useState } from 'preact/hooks';
import { Message, MessageContent } from '@/types';

interface MessageBubbleProps {
  message: Message;
  onCopySuccess: (message: string) => void;
}

/**
 * 消息气泡组件
 */
export function MessageBubble({ message, onCopySuccess }: MessageBubbleProps) {
  // 管理每个内容项的展开状态
  const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>({});

  // 处理复制
  const handleCopy = async (text: string, event: Event) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      onCopySuccess('已复制');
      
      // 添加视觉反馈
      const target = event.target as HTMLElement;
      const button = target.closest('.encrypted-attachment') || target;
      button.classList.add('copied');
      setTimeout(() => {
        button.classList.remove('copied');
      }, 1000);
    } catch (err) {
      console.error('复制失败:', err);
      onCopySuccess('复制失败');
    }
  };

  // 切换展开状态
  const toggleExpanded = (index: number) => {
    setExpandedStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // 格式化文本
  const formatText = (text: string) => {
    return text.replace(/\n/g, '<br>');
  };

  // 获取显示文本
  const getDisplayText = (text: string, type: string, index: number) => {
    if (type === 'encrypted') {
      return text;
    }

    const maxLength = 1000;
      const isExpanded = expandedStates[index];
    
    if (text.length <= maxLength || isExpanded) {
      return text;
    }
    
    return text.substring(0, maxLength) + '...';
  };

  // 判断是否显示展开按钮
  const shouldShowExpandButton = (text: string, type: string) => {
    return type !== 'encrypted' && text.length > 1000;
  };



  const formatEncryptedText = (text: string) => {
    const prefix = text.startsWith('AES-GCM:') ? text.substring(8) : text;
    if (prefix.length <= 16) return prefix;
    
    const start = prefix.substring(0, 6);
    const end = prefix.substring(prefix.length - 6);
    return `${start}****${end}`;
  };

  return (
    <div className={`message-bubble ${message.type === 'right' ? 'right-bubble' : 'left-bubble'}`}>
      {/* 解密消息：密文在气泡左上方 */}
      {message.type === 'left' && message.content.length > 1 && (
        <div 
          className="encrypted-attachment left-attachment"
          onClick={(e) => handleCopy(message.content[1].text, e as any)}
          title="点击复制密文"
        >
          <span className="encrypted-text">
            {formatEncryptedText(message.content[0].text)}
          </span>
          <span className="encrypted-time">解密于 {message.time}</span>
          <i className="bi bi-clipboard-fill"></i>
          <span className="copy-text">复制</span>
        </div>
      )}
      
      {/* 主要消息内容 */}
      <div className="bubble-content">
        {message.content.map((contentItem: MessageContent, index: number) => {
          // 跳过加密文本，因为它会显示在外部
          if (contentItem.type === 'encrypted') return null;
          
          return (
            <div key={index} className="message">
          <div 
                className="message-content"
            dangerouslySetInnerHTML={{ __html: formatText(getDisplayText(contentItem.text, contentItem.type, index)) }}
          />
          {shouldShowExpandButton(contentItem.text, contentItem.type) && (
            <div className="expand-control">
              <button
                className="expand-btn"
                onClick={() => toggleExpanded(index)}
              >
                    {expandedStates[index] ? '收起' : '展开'}
              </button>
            </div>
          )}
        </div>
          );
        })}
      </div>
      
      {/* 加密消息：密文在气泡右下方 */}
      {message.type === 'right' && message.content.length > 1 && (
        <div 
          className="encrypted-attachment right-attachment"
          onClick={(e) => handleCopy(message.content[1].text, e as any)}
          title="点击复制密文"
        >
          <span className="encrypted-text">
            {formatEncryptedText(message.content[1].text)}
          </span>
          <span className="encrypted-time">加密于 {message.time}</span>
          <i className="bi bi-clipboard-fill"></i>
          <span className="copy-text">复制</span>
        </div>
      )}
    </div>
  );
} 