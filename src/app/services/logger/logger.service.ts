import { Injectable } from '@angular/core';
import { LogLevel } from './log-level.enum';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isProduction = false;  // Установите в true для продакшена, чтобы отключить debug-логи

  private logWithLevel(level: LogLevel, message: string, ...optionalParams: any[]) {
    if (level === LogLevel.Debug && this.isProduction) {
      return;  // Игнорируем debug в продакшене
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

    // Здесь можно добавить отправку логов на сервер (например, через HttpClient)
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

  // Пример метода для отправки логов на сервер (опционально)
  // private sendToServer(level: LogLevel, message: string, params: any[]) {
  //   // Используйте HttpClient для POST на /api/logs
  // }
}