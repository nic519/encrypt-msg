import { render } from 'preact';
import { App } from './components';
import './styles/index.css';

/**
 * 应用程序入口点
 */
function main() {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container not found');
  }

  render(<App />, container);
}

// 启动应用
main(); 