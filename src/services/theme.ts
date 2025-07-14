/**
 * 主题管理服务
 * 支持自动跟随系统主题和手动切换
 */
class ThemeService {
  private static instance: ThemeService;
  
  static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }
  
  /**
   * 初始化主题系统
   * 自动检测系统主题并设置
   */
  init(): void {
    // 检测系统主题
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 设置初始主题
    this.setTheme(isDark ? 'dark' : 'light');
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.setTheme(e.matches ? 'dark' : 'light');
    });
  }
  
  /**
   * 设置主题
   */
  private setTheme(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  /**
   * 切换主题
   */
  toggle(): void {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  /**
   * 获取当前主题
   */
  getCurrentTheme(): 'light' | 'dark' {
    return document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
  }
}

export const themeService = ThemeService.getInstance(); 