import { useRef } from 'preact/hooks';
import { JSX } from 'preact';

interface InputAreaProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onEncrypt: () => void;
  onDecrypt: () => void;
  onToggleTips: () => void;
  disabled?: boolean;
}

/**
 * 输入区域组件
 */
export function InputArea({ 
  inputText, 
  onInputChange, 
  onEncrypt, 
  onDecrypt, 
  onToggleTips,
  disabled = false
}: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (inputText.trim()) {
        onEncrypt();
      }
    }
  };

  const handleClearText = () => {
    onInputChange('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="input-area">
      <div className="textarea-container">
        <textarea
          ref={textareaRef}
          id="message-input"
          placeholder="输入要加密的文本..."
          value={inputText}
          onInput={(e) => onInputChange((e.target as HTMLTextAreaElement).value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        {inputText && (
          <button 
            className="clear-btn" 
            onClick={handleClearText}
            title="清空文本"
          >
            ✖️
          </button>
        )}
      </div>
      
      <div className="input-actions">
        <button 
          className="help-btn" 
          onClick={onToggleTips}
          title="显示/隐藏帮助信息"
        >
          ❓
        </button>
        
        <div className="main-actions">
          <button 
            className="action-btn decrypt-btn" 
            onClick={onDecrypt}
            disabled={disabled}
          >
            <span className="btn-icon">🔓</span>
            <span className="btn-text">粘贴并解密</span>
          </button>
          
          <button 
            className="action-btn encrypt-btn" 
            onClick={onEncrypt}
            disabled={disabled || !inputText.trim()}
          >
            <span className="btn-icon">🔒</span>
            <span className="btn-text">加密</span>
          </button>
        </div>
      </div>
    </div>
  );
} 