const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, printf, errors } = format;

const default_logger_format = printf(
  ({ level, message, timestamp, service, stack }) => {
    return `${timestamp} ${level}: 
    ${stack || message}  Service : ${service}`;
  }
);

const infoAndWarnFilter = format((info, opts) => {
  return info.level === "info" || info.level === "warn" ? info : false;
})();

const errorFilter = format((info, opts) => {
  return info.level === "error" ? info : false;
})();

var transport_config = [
  //
  // - Write all logs with level `error` and below to `error.log`
  // - Write all logs with level `info` and below to `combined.log`
  //
  new transports.File({
    filename: "logger/logs/error.log",
    level: "error",
    prettyPrint: true,
    format: combine(
      errorFilter,
      timestamp(),
      errors({ stack: true }),
      default_logger_format
    ),
  }),
  new transports.File({
    filename: "logger/logs/info.log",
    prettyPrint: true,
    level: "info",
    format: combine(infoAndWarnFilter, timestamp(), default_logger_format),
  }),
  new transports.Console({
    format: combine(
      timestamp(),
      colorize(),
      errors({ stack: true }),
      default_logger_format
    ),
  }),
];
if (process.env.NODE_ENV == "test") {
  transport_config.pop();
}

const logger = createLogger({
  transports: transport_config,
  format: combine(timestamp(), format.json(), default_logger_format),
  defaultMeta: { service: "user-service" },
});

module.exports = logger;
