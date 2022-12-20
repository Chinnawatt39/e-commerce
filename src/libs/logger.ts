import os from "os";
import path from "path";
import process from "process";
import { createLogger, transports, format } from "winston";

import "winston-daily-rotate-file";
import { LogFile } from "./types";

const addMeta = format((info) => {
  info.hostname = os.hostname();
  info.pid = process.pid;
  info.ptitle = process.title;
  info.level = info.level = info.level.padEnd(6);
  info.label = info.label.padEnd(15);

  return info;
});

let _logFile: LogFile;

export const WinstonLogger = (filename: string, logFile: LogFile) => {
  const label = path.parse(filename).name;

  // save log file config for WinstonCreator()
  _logFile = logFile;

  const logger = createLogger({
    format: format.combine(
      format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      format.label({ label: label }),
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.splat(),
      addMeta(),
      format.json()
    ),
    transports: [
      // - Write all logs with level of `error` or less to `filename.error.log`
      new transports.File({
        filename: path.join(__dirname, _logFile.error),
        level: "error",
      }),
      // - Rotate log file filen-YYYY-MM-DD.log
      new transports.DailyRotateFile({
        filename: path.join(__dirname, `${_logFile.all}`),
        datePattern: "YYYY-MM-DD",
        maxFiles: "30d",
        level: process.env.NODE_ENV === "production" ? "info" : "silly",
      }),
    ],

    exitOnError: false,
  });

  // disable console log in production
  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new transports.Console({
        level: "silly",
        format: format.combine(
          format((info) => {
            info.level = info.level.toUpperCase();
            return info;
          })(),
          format.label({ label: label }),
          format.colorize(),
          format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
          }),
          format.splat(),
          addMeta(),
          format.printf(({ timestamp, level, label, message, ...meta }) => {
            if (meta.topic) {
              return `${timestamp} : ${level} : ${meta.pid} : ${label} - ${message}, [topic=${meta.topic}, offset=${meta.offset}]`;
            } else {
              return `${timestamp} : ${level} : ${meta.pid} : ${label} - ${message}`;
            }
          })
          // format.prettyPrint()
        ),
      })
    );
  }

  return logger;
};

/**
 * Create winston logger for kafkajs
 *
 * @returns kafka log creator
 */
export const WinstonLogCreator = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ level, log }: { level: string; log: any }) => {
    const { message, ...meta } = log;
    const logger = WinstonLogger("qim-server", _logFile);

    logger.log(level, message, meta);
  };
};
