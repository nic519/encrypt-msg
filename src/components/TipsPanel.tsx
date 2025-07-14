import { JSX } from 'preact';

interface TipsPanelProps {
  show: boolean;
  onClose: () => void;
}

/**
 * 帮助提示面板组件
 */
export function TipsPanel({ show, onClose }: TipsPanelProps) {
  if (!show) return null;

  const handleBackdropClick = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="tips-backdrop" onClick={handleBackdropClick}></div>
      <div className="tips" id="tipsContainer">
        <div className="tips-header">
          <h3>使用帮助</h3>
          <button className="close-tips-btn" onClick={onClose}>
            ✖️
          </button>
        </div>
        <ul>
          <li>
            <span className="emoji">🛡️</span> 
            本工具完全在浏览器中运行，不会上传任何数据
          </li>
          <li>
            <span className="emoji">🔄</span> 
            每次加密结果都不同，增强安全性
          </li>
        </ul>
      </div>
    </>
  );
} 