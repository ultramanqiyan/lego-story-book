type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class GameLogger {
  private enabled: boolean = true;
  private prefix: string = '[炉石传说]';

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `${this.prefix}[${timestamp}][${level.toUpperCase()}] ${message}${dataStr}`;
  }

  info(message: string, data?: any): void {
    if (!this.enabled) return;
    console.log(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any): void {
    if (!this.enabled) return;
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, data?: any): void {
    if (!this.enabled) return;
    console.error(this.formatMessage('error', message, data));
  }

  debug(message: string, data?: any): void {
    if (!this.enabled) return;
    console.debug(this.formatMessage('debug', message, data));
  }

  logInteraction(action: string, data?: any): void {
    this.info(`[交互] ${action}`, data);
  }

  logGameState(state: string, data?: any): void {
    this.info(`[状态] ${state}`, data);
  }

  logAnimation(type: string, target: string): void {
    this.debug(`[动画] ${type} -> ${target}`);
  }

  logError(context: string, error: Error): void {
    this.error(`[错误] ${context}`, { message: error.message, stack: error.stack });
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }
}

export const logger = new GameLogger();
export default logger;
