import pino from 'pino';
import { PrettyOptions } from 'pino-pretty';

class Logger {
  private logger: pino.Logger;

  constructor() {
    const prettyOptions: PrettyOptions = {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
    };

    const isProduction = process.env.NODE_ENV === 'production';
    const logLevel = isProduction ? 'info' : 'debug';

    const loggerOptions = {
      pretty: prettyOptions,
      level: logLevel,
    };

    this.logger = pino(loggerOptions);
  }

  public info(message: string, data?: any): void {
    this.logger.info({ message, data });
  }

  public error(message: string, error: Error): void {
    this.logger.error({ message, error });
  }

  public debug(message: string, data?: any): void {
    this.logger.debug({ message, data });
  }

  public setLevel(level: string): void {
    this.logger.level = level;
  }
}

export default Logger;
