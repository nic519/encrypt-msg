import { Message } from '@/types';
import { messageService } from '@/services';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  onCopySuccess: (message: string) => void;
}

/**
 * 消息列表组件
 */
export function MessageList({ messages, onCopySuccess }: MessageListProps) {
  const validMessages = messageService.filterValidMessages(messages);

  return (
    <div className="messages-container" id="messages-area">
      {/* 标题消息 */}
      <div className="title-bubble">
        <div className="title-content">
          <h1>🔐 文本加密工具</h1>
        </div>
      </div>

      {/* 消息列表 */}
      {validMessages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          onCopySuccess={onCopySuccess}
        />
      ))}
    </div>
  );
} 