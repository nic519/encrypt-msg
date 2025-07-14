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
          <h3>帮助</h3>
          <button className="close-tips-btn" onClick={onClose}>
            <i className="bi bi-x-circle-fill"></i>
          </button>
        </div>
        <div className="tips-content">
        <ul>
          <li>
              <i className="bi bi-shield-check-fill"></i>
              完全本地运行，数据不上传
            </li>
            <li>
              <i className="bi bi-arrow-repeat"></i>
              每次加密结果不同
            </li>
            <li>
              <i className="bi bi-moon-fill"></i>
              自动跟随系统主题
          </li>
          <li>
              <i className="bi bi-phone-fill"></i>
              支持移动端和桌面端
          </li>
        </ul>
        </div>
      </div>
    </>
  );
} 