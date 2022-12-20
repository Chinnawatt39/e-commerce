import { Router } from "express";
import conect from "../controller/database";
import moment = require("moment");
const router = Router();
import cors from "cors";
import config from "../config/config.json";
import { WinstonLogger } from "../libs/logger";
import { Logger } from "winston";
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

router.post("/get/data/all", async function (req, res) {
  res.json(await get_data_user_all());
});

router.post("/get/data/:username", async function (req, res) {
  res.json(await get_data_user_detail(req.params.username));
});

router.put("/edit/data/:username", async function (req, res) {
  res.json(await edit_data_user(req, req.params.username));
});

router.delete("/delete/user/:username", async function (req, res) {
  res.json(await delete_data_user(req, req.params.username));
});

export async function get_data_user_all() {
  return new Promise((resolve: any) => {
    var sql: string = `SELECT username, password, role_name, first_name, mid_name, last_name, email, address, number_phone, birthday FROM users`;
    var values: Array<string | number> = [];

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

export async function get_data_user_detail(username: string) {
  return new Promise((resolve: any) => {
    var sql: string = `SELECT username, role_name, first_name, mid_name, last_name, email, address, number_phone, birthday 
    FROM users WHERE username = ?`;
    var values: Array<string> = [username];

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

export async function edit_data_user(req: any, username: string) {
  return new Promise((resolve: any) => {
    var sql: string = `UPDATE users 
    SET  first_name = ? , mid_name = ?, last_name = ?, email = ?, address = ?, number_phone = ?, birthday = ?, modified_date = ? 
    WHERE username = ?`;
    var values: Array<string | number> = [
      req.body.first_name,
      req.body.mid_name,
      req.body.last_name,
      req.body.email,
      req.body.address,
      req.body.birthday,
      moment().format("YYYY/MM/DD HH:mm:ss"),
      username,
    ];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        logger.info(
          "edit data user username : " +
            username +
            " date : " +
            moment().format("YYYY/MM/DD HH:mm:ss")
        );
        resolve(result);
      })
      .catch((err: any) => {
        logger.error("edit data username err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function delete_data_user(req: any, username: string) {
  return new Promise((resolve: any) => {
    var sql: string = `DELETE FROM users WHERE username = ?`;
    var values: Array<string | number> = [username];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        logger.info(
          "delete data user username : " +
            username +
            " date : " +
            moment().format("YYYY/MM/DD HH:mm:ss")
        );
        resolve(result);
      })
      .catch((err: any) => {
        logger.error("delete data faq err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export default router;
