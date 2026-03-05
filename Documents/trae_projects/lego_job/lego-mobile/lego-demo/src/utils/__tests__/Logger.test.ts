import { Logger, LogLevel } from '../Logger';

describe('Logger', () => {
  let originalConsole: typeof console;
  let mockConsole: {
    log: jest.Mock;
    info: jest.Mock;
    warn: jest.Mock;
    error: jest.Mock;
    debug: jest.Mock;
  };

  beforeEach(() => {
    originalConsole = global.console;
    mockConsole = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };
    global.console = mockConsole as unknown as typeof console;
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  describe('基本功能', () => {
    it('应该能够创建带有模块名的Logger实例', () => {
      const logger = new Logger('TestModule');
      expect(logger).toBeDefined();
      expect(logger.module).toBe('TestModule');
    });

    it('应该能够输出info级别日志', () => {
      const logger = new Logger('TestModule');
      logger.info('test message');
      expect(mockConsole.info).toHaveBeenCalled();
    });

    it('应该能够输出warn级别日志', () => {
      const logger = new Logger('TestModule');
      logger.warn('warning message');
      expect(mockConsole.warn).toHaveBeenCalled();
    });

    it('应该能够输出error级别日志', () => {
      const logger = new Logger('TestModule');
      logger.error('error message');
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it('应该能够输出debug级别日志', () => {
      const logger = new Logger('TestModule');
      logger.debug('debug message');
      expect(mockConsole.debug).toHaveBeenCalled();
    });
  });

  describe('日志级别过滤', () => {
    it('当设置为ERROR级别时，应该只输出error日志', () => {
      const logger = new Logger('TestModule', LogLevel.ERROR);
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).not.toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it('当设置为WARN级别时，应该输出warn和error日志', () => {
      const logger = new Logger('TestModule', LogLevel.WARN);
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it('当设置为DEBUG级别时，应该输出所有日志', () => {
      const logger = new Logger('TestModule', LogLevel.DEBUG);
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      expect(mockConsole.debug).toHaveBeenCalled();
      expect(mockConsole.info).toHaveBeenCalled();
      expect(mockConsole.warn).toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalled();
    });
  });

  describe('日志格式', () => {
    it('日志应该包含时间戳、模块名和消息', () => {
      const logger = new Logger('TestModule');
      logger.info('test message');
      const call = mockConsole.info.mock.calls[0][0];
      expect(call).toContain('TestModule');
      expect(call).toContain('test message');
      expect(call).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    it('应该支持格式化参数', () => {
      const logger = new Logger('TestModule');
      logger.info('user %s logged in', 'John');
      const call = mockConsole.info.mock.calls[0][0];
      expect(call).toContain('John');
    });
  });

  describe('静态方法', () => {
    it('应该能够设置全局日志级别', () => {
      Logger.setGlobalLevel(LogLevel.ERROR);
      const logger = new Logger('TestModule');
      logger.info('should not appear');
      expect(mockConsole.info).not.toHaveBeenCalled();
    });

    it('应该能够创建子Logger', () => {
      const parentLogger = new Logger('Parent');
      const childLogger = parentLogger.child('Child');
      expect(childLogger.module).toBe('Parent:Child');
    });
  });
});
