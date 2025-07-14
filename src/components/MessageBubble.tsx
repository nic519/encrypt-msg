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

  const formatText = (text: string, type: string) => {
    if (type === 'encrypted') {
      return text;
    }
    return text
      .replace(/\n/g, '<br>')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/ {2}/g, '&nbsp;&nbsp;');
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
            dangerouslySetInnerHTML={{ __html: formatText(contentItem.text, contentItem.type) }}
          />
        </div>
      ))}
    </div>
  );
} 