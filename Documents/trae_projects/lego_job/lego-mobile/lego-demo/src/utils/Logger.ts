import { LogEntry } from '../types';

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private enabled: boolean = true;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private addLog(level: LogEntry['level'], message: string, data?: any): void {
    if (!this.enabled) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: this.formatTimestamp(),
      data
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.outputToConsole(entry);
  }

  private outputToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    const fullMessage = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'error':
        console.error(fullMessage, entry.data || '');
        break;
      case 'warn':
        console.warn(fullMessage, entry.data || '');
        break;
      case 'debug':
        console.debug(fullMessage, entry.data || '');
        break;
      default:
        console.log(fullMessage, entry.data || '');
    }
  }

  info(message: string, data?: any): void {
    this.addLog('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.addLog('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.addLog('error', message, data);
  }

  debug(message: string, data?: any): void {
    this.addLog('debug', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  clearLogs(): void {
    this.logs = [];
    this.info('日志已清空');
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  logGameAction(action: string, data?: any): void {
    this.info(`[GAME_ACTION] ${action}`, data);
  }

  logUserInteraction(action: string, data?: any): void {
    this.info(`[USER_INTERACTION] ${action}`, data);
  }

  logAnimation(type: string, targetId: string, data?: any): void {
    this.debug(`[ANIMATION] ${type} - Target: ${targetId}`, data);
  }

  logError(context: string, error: Error): void {
    this.error(`[ERROR] ${context}`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }

  logPerformance(metric: string, value: number): void {
    this.debug(`[PERFORMANCE] ${metric}: ${value}ms`);
  }
}

export const logger = Logger.getInstance();
export default logger;
