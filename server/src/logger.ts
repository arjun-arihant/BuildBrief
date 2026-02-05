/**
 * Structured Logging Utility
 * @module logger
 */

import { createWriteStream } from 'fs';
import { format } from 'util';

/**
 * Log levels in order of severity
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Log entry structure
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  requestId?: string;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  logFilePath?: string;
  enableColors: boolean;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  minLevel: (process.env.LOG_LEVEL as LogLevel) || 'info',
  enableConsole: true,
  enableFile: false,
  enableColors: process.env.NODE_ENV !== 'production'
};

/**
 * Log level priorities
 */
const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4
};

/**
 * ANSI color codes
 */
const colors = {
  reset: '\x1b[0m',
  debug: '\x1b[36m',    // Cyan
  info: '\x1b[32m',     // Green
  warn: '\x1b[33m',     // Yellow
  error: '\x1b[31m',    // Red
  fatal: '\x1b[35m'     // Magenta
};

/**
 * Simple Logger class with structured logging
 */
class Logger {
  private config: LoggerConfig;
  private fileStream?: ReturnType<typeof createWriteStream>;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    
    if (this.config.enableFile && this.config.logFilePath) {
      this.fileStream = createWriteStream(this.config.logFilePath, { flags: 'a' });
    }
  }

  /**
   * Check if log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    return levelPriority[level] >= levelPriority[this.config.minLevel];
  }

  /**
   * Format log entry for output
   */
  private formatEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, error, requestId } = entry;
    
    let output = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (requestId) {
      output += ` [${requestId}]`;
    }
    
    output += ` ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      output += ` | ${JSON.stringify(context)}`;
    }
    
    if (error) {
      output += ` | Error: ${error.message}`;
      if (error.stack) {
        output += `\n${error.stack}`;
      }
    }
    
    return output;
  }

  /**
   * Colorize log output
   */
  private colorize(level: LogLevel, text: string): string {
    if (!this.config.enableColors) return text;
    return `${colors[level]}${text}${colors.reset}`;
  }

  /**
   * Write log entry
   */
  private write(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const formatted = this.formatEntry(entry);

    // Console output
    if (this.config.enableConsole) {
      const consoleMethod = entry.level === 'error' || entry.level === 'fatal' 
        ? console.error 
        : entry.level === 'warn' 
          ? console.warn 
          : console.log;
      
      consoleMethod(this.colorize(entry.level, formatted));
    }

    // File output
    if (this.fileStream) {
      this.fileStream.write(formatted + '\n');
    }
  }

  /**
   * Create log entry with common fields
   */
  private createEntry(
    level: LogLevel, 
    message: string, 
    context?: Record<string, unknown>,
    error?: Error,
    requestId?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      requestId
    };
  }

  // Public logging methods
  
  debug(message: string, context?: Record<string, unknown>, requestId?: string): void {
    this.write(this.createEntry('debug', message, context, undefined, requestId));
  }

  info(message: string, context?: Record<string, unknown>, requestId?: string): void {
    this.write(this.createEntry('info', message, context, undefined, requestId));
  }

  warn(message: string, context?: Record<string, unknown>, requestId?: string): void {
    this.write(this.createEntry('warn', message, context, undefined, requestId));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>, requestId?: string): void {
    this.write(this.createEntry('error', message, context, error, requestId));
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>, requestId?: string): void {
    this.write(this.createEntry('fatal', message, context, error, requestId));
  }

  /**
   * Create child logger with default context
   */
  child(defaultContext: Record<string, unknown>): Logger {
    const childLogger = new Logger(this.config);
    const parentWrite = this.write.bind(this);
    
    childLogger['write'] = (entry: LogEntry) => {
      entry.context = { ...defaultContext, ...entry.context };
      parentWrite(entry);
    };
    
    return childLogger;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export Logger class for custom instances
export { Logger };
