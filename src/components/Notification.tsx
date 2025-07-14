interface NotificationProps {
  show: boolean;
  message: string;
}

/**
 * 通知组件
 */
export function Notification({ show, message }: NotificationProps) {
  return (
    <div className={`copy-success ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
} 