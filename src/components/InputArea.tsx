import { useRef } from 'preact/hooks';
import { JSX } from 'preact';

interface InputAreaProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onEncrypt: () => void;
  onDecrypt: () => void;
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
    textareaRef.current?.focus();
  };

  // 智能判断解密按钮文案
  const getDecryptButtonText = () => {
    const trimmedText = inputText.trim();
    if (trimmedText) {
      return '解密输入框内容';
    }
    return '解密剪切板内容';
  };

  return (
    <div className="input-area">
      <div className="textarea-container">
        <textarea
          ref={textareaRef}
          id="message-input"
          value={inputText}
          onInput={(e) => onInputChange((e.target as HTMLTextAreaElement).value)}
          onKeyDown={handleKeyDown}
          placeholder="输入文本..."
          disabled={disabled}
        />
        
        {inputText && (
          <button 
            className="clear-btn" 
            onClick={handleClearText}
            type="button"
            aria-label="清除文本"
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
        )}
      </div>
      
      <div className="input-actions">
          <button 
            className="action-btn decrypt-btn" 
            onClick={onDecrypt}
            disabled={disabled}
          >
          <i className="bi bi-unlock-fill"></i>
          <span>{getDecryptButtonText()}</span>
          </button>
          
          <button 
            className="action-btn encrypt-btn" 
            onClick={onEncrypt}
            disabled={disabled || !inputText.trim()}
          >
          <i className="bi bi-lock-fill"></i>
          <span>加密</span>
          </button>
      </div>
    </div>
  );
} 