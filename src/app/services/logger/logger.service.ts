import { Injectable } from '@angular/core';
import { LogLevel } from './log-level.enum';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isProduction = false;

  private logWithLevel(level: LogLevel, message: string, ...optionalParams: any[]) {
    if (level === LogLevel.Debug && this.isProduction) {
      return;
    }

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${level}] [${timestamp}]: ${message}`;

    switch (level) {
      case LogLevel.Info:
        console.info(formattedMessage, ...optionalParams);
        break;
      case LogLevel.Warn:
        console.warn(formattedMessage, ...optionalParams);
        break;
      case LogLevel.Error:
        console.error(formattedMessage, ...optionalParams);
        break;
      case LogLevel.Debug:
        console.debug(formattedMessage, ...optionalParams);
        break;
      default:
        console.log(formattedMessage, ...optionalParams);
    }

    // this.sendToServer(level, message, optionalParams);
  }

  info(message: string, ...optionalParams: any[]) {
    this.logWithLevel(LogLevel.Info, message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.logWithLevel(LogLevel.Warn, message, ...optionalParams);
  }

  error(message: string | Error, ...optionalParams: any[]) {
    const errorMessage = message instanceof Error ? message.message : message;
    const stack = message instanceof Error ? message.stack : undefined;
    this.logWithLevel(LogLevel.Error, errorMessage, ...optionalParams, stack);
  }

  debug(message: string, ...optionalParams: any[]) {
    this.logWithLevel(LogLevel.Debug, message, ...optionalParams);
  }

  // private sendToServer(level: LogLevel, message: string, params: any[]) {
  //   // HttpClient POST /api/logs
  // }
}