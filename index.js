const express = require("express");
const cors = require("cors");
const path = require("path");
const { appLogger, httpLogStream } = require("./config/customLogger");
const morgan = require("morgan");
const mongoose = require("mongoose");

const directoryRouter = require("./routes/directory/dirctory-routes");
const uploadRouter = require("./routes/upload/upload-routes");

// const logger = require("./config/customLogger");
// require("dotenv").config({ path: path.join(__dirname, "./.env.dev") });
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined"; // NOTE: morgan 출력 형
if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: path.join(__dirname, "./.env") });
  console.log("production mode");
  console.log(process.env.PORT);
} else {
  // dotenv.config({ path: path.join('/env', './local.env')});
  require("dotenv").config({ path: path.join(__dirname, "./.env.dev") });
  console.log("development mode");
  console.log(process.env.PORT);
  console.log(process.env.NAVER_CLOUD_END_POINT);
}

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/views"));
// app.use(morgan("combined", { stream }));
// app.use(morgan(morganFormat, { stream: logger.httpLogStream })); // NOTE: http request 로그 남기기
app.use(morgan(morganFormat, { httpLogStream }));

// 라우터 설정
app.use("", directoryRouter);
app.use("/upload", uploadRouter);
// app.use("", categoryRouter);
// app.use("/login", loginRouter);
// app.use("/upload", uploadRouter);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((e) => console.log(e));

app.listen(process.env.PORT, (req, res) => {
  console.log(`Listening at Prot :: ${process.env.PORT}`);
  console.log(`MONGO_URL : ${process.env.MONGO_URL}`);
});
