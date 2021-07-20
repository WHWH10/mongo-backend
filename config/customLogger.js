const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const { combine, label, printf } = format;
const path = require("path");
const mt = require("moment-timezone");
const winstonDaily = require("winston-daily-rotate-file");

const date = mt().tz("Asia/Seoul"); // NOTE: 날짜는 한국 시간으로 하고 싶다.
const myFormat = printf(
  (info) => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`
); // NOTE: 로그 형식 설정
const koreaTime = format((info) => {
  // NOTE: 한국 시간으로 하기 위해.. 설정을 안 할 시 에는 UTC 0이 default다.
  info.timestamp = date.format();
  return info;
});

const defaultDir = "/Users/clmns/vscode_workspace/hyd_workspace/logs/default";
const errorDir = "/Users/clmns/vscode_workspace/hyd_workspace/logs/error";

const httpDir = "/Users/clmns/vscode_workspace/hyd_workspace/logs/http/default";
const httpErrorDir =
  "/Users/clmns/vscode_workspace/hyd_workspace/logs/http/error";

// if (!fs.existsSync(defaultDir)) {
//   fs.mkdirSync(defaultDir);
// }

// if (!fs.existsSync(errorDir)) {
//   fs.mkdirSync(errorDir);
// }

// if (!fs.existsSync(httpDir)) {
//   fs.mkdirSync(httpDir);
// }

// if (!fs.existsSync(httpErrorDir)) {
//   fs.mkdirSync(httpErrorDir);
// }

const logType = {
  // 걍 만들어본 서비스 enum
  1: "join",
  2: "login",
  3: "spend_item",
  4: "system",
};

const appLogger = (type) => {
  // NOTE: application log를 남기기 위함.
  const init = createLogger({
    format: combine(
      // label({ label: logType[type] }), // NOTE: 어떤 서비스인지 알기 위함
      koreaTime(),
      // format.json(),
      myFormat
    ),
    transports: [
      new winstonDaily({
        // level: "info",
        datePattern: "YYYY-MM-DD",
        dirname: defaultDir,
        filename: `app.%DATE%.log`,
        maxFiles: 10,
        zippedArchive: true,
      }),
      new winstonDaily({
        level: "error",
        datePattern: "YYYY-MM-DD",
        dirname: errorDir,
        filename: `error.%DATE%.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
      //   new transports.File({
      //     filename: path.join(__dirname, "logs", "app-error.log"),
      //     level: "error",
      //   }), // NOTE: 에러는 별도로 보기 위함
      //   new transports.File({
      //     filename: path.join(
      //       __dirname,
      //       `logs`,
      //       date.format("YYYY-MM-DD"),
      //       "app.log"
      //     ),
      //   }), // NOTE: 모든 로그 (에러 포함)
    ],
  });
  if (process.env.NODE_ENV !== "production") {
    // NOTE: 실제 서비스 환경이 아닐 시에는 출력을 해야 바로 바로 보기 편함.
    init.add(new transports.Console());
  }
  return init;
};

const httpLogger = createLogger({
  // NOTE: http status 로그를 남기기 위함.
  format: combine(label({ label: "http" }), koreaTime(), myFormat),
  transports: [
    new winstonDaily({
      // level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: httpDir,
      filename: `http.%DATE%.log`,
      maxFiles: 10,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: httpErrorDir,
      filename: `http.error.%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
    // new transports.File({
    //   filename: path.join(
    //     __dirname,
    //     "logs",
    //     date.format("YYYY-MM-DD"),
    //     "http.log"
    //   ),
    // }),
  ],
});

const httpLogStream = {
  write: (message) => {
    // NOTE: morgan에서 쓰기 위해 이 형태로 fix 되야함.
    httpLogger.log({
      level: "info",
      message: message,
    });
  },
};

exports.appLogger = appLogger;
exports.httpLogStream = httpLogStream;
