import { useState } from 'preact/hooks';
import { Message, MessageContent } from '@/types';
import { uiService } from '@/services';

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

  // 加密内容的字符数限制
  const ENCRYPTED_TEXT_LIMIT = 120;

  const handleCopy = async (content: string, event: MouseEvent) => {
    try {
      await uiService.copyToClipboard(content);
      const button = (event.target as HTMLElement).closest('.message-copy-btn') as HTMLElement;
      if (button) {
        uiService.updateCopyButtonState(button);
      }
      onCopySuccess('已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制');
    }
  };

  const toggleExpanded = (index: number) => {
    setExpandedStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatText = (text: string, type: string) => {
    if (type === 'encrypted') {
      return text;
    }
    return text
      .replace(/\n/g, '<br>')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/ {2}/g, '&nbsp;&nbsp;');
  };

  const getDisplayText = (text: string, type: string, index: number) => {
    if (type === 'encrypted' && text.length > ENCRYPTED_TEXT_LIMIT) {
      const isExpanded = expandedStates[index];
      if (!isExpanded) {
        return text.substring(0, ENCRYPTED_TEXT_LIMIT) + '...';
      }
    }
    return text;
  };

  const shouldShowExpandButton = (text: string, type: string) => {
    return type === 'encrypted' && text.length > ENCRYPTED_TEXT_LIMIT;
  };

  return (
    <div className={`message-bubble ${message.type === 'right' ? 'right-bubble' : 'left-bubble'}`}>
      {message.content.map((contentItem: MessageContent, index: number) => (
        <div key={index} className={`message ${contentItem.type === 'encrypted' ? 'encrypt-message' : ''}`}>
          <div className="message-header">
            <div className="message-label">
              <span>{contentItem.label}</span>
              {index === 0 && <span className="message-time">{message.time}</span>}
            </div>
            <button 
              className="message-copy-btn"
              onClick={(e) => handleCopy(contentItem.text, e as any)}
            >
              <span className="copy-icon"></span>
              <span>复制</span>
            </button>
          </div>
          <div 
            className={`message-content ${contentItem.type === 'encrypted' ? 'encrypted-content' : ''}`}
            dangerouslySetInnerHTML={{ __html: formatText(getDisplayText(contentItem.text, contentItem.type, index), contentItem.type) }}
          />
          {shouldShowExpandButton(contentItem.text, contentItem.type) && (
            <div className="expand-control">
              <button
                className="expand-btn"
                onClick={() => toggleExpanded(index)}
              >
                {expandedStates[index] ? '收起' : '展开全部'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 