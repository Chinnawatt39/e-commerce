import { Router } from "express";
import conect from "../controller/database";
import moment = require("moment");
const router = Router();
import cors from "cors";
import config from "../config/config.json";
import { WinstonLogger } from "../libs/logger";
import { Logger } from "winston";
import jwt from "jsonwebtoken";
import session from "express-session";
const logger: Logger = WinstonLogger(__filename, config.log);
const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "*",
  preflightContinue: false,
};

router.post("/register", async function (req, res) {
  res.json(await register(req));
});

router.post("/login", async function (req, res) {
  const jwtKey = "my_secret_key";
  const jwtExpirySeconds = 300;
  var user_data: any = await auth_login(req.body.username, req.body.password);
  let { username, password } = req.body;

  const token = jwt.sign({ username }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  });

  if (user_data.length != 0) {
    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
    user_data[0]["token"] = token;
    user_data[0]["exp"] = { maxAge: jwtExpirySeconds * 1000 };
    session.Cookie = user_data[0];
    res.json(user_data[0]).end();
  } else {
    logger.error(
      "Login Fail : Wrong Password #" + moment().format("DD/MM/YYYY HH:mm:ss")
    );
    res.json({ status: "Login Fail" }).end();
  }
});

export async function register(req: any) {
  return new Promise((resolve: any) => {
    var sql: string = `INSERT INTO users(username, password,img_profile, role_name, first_name, mid_name, last_name, email, address, number_phone, birthday, create_date)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;
    var values: Array<string | number> = [
      req.body.username,
      req.body.password,
      req.body.img_profile,
      req.body.role_name,
      req.body.first_name,
      req.body.mid_name,
      req.body.last_name,
      req.body.email,
      req.body.address,
      req.body.number_phone,
      req.body.birthday,
      moment().format("YYYY/MM/DD HH:mm:ss"),
    ];

    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        resolve({ status: "success", msg: "register success" });
      })
      .catch((err: any) => {
        logger.error("get data faq err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function auth_login(username: string, password: string) {
  return new Promise((resolve: any) => {
    var sql: string = `SELECT username, role_name FROM users WHERE username = ? AND password = ?`;
    var values: Array<string> = [username, password];

    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        resolve(result);
      })
      .catch((err: any) => {
        logger.error("get data faq err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export default router;
