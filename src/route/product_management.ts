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
  res.json(await get_data_product_all());
});

router.post("/get/data/:product_id", async function (req, res) {
  res.json(await get_data_product_detail(req.params.product_id));
});

router.post("/add/data", async function (req, res) {
  res.json(await add_data_product(req));
});

router.put("/edit/data/:product_id", async function (req, res) {
  res.json(await edit_data_product(req, req.params.product_id));
});

router.delete("/delete/:product_id", async function (req, res) {
  res.json(await delete_data_user(req, req.params.product_id));
});

export async function get_data_product_all() {
  return new Promise((resolve: any) => {
    var sql: string = `SELECT product_name, product_img
    FROM product`;
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
        logger.error("get data product err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function get_data_product_detail(productid: string) {
  return new Promise((resolve: any) => {
    var sql: string = `SELECT p.product_id, p.price, p.product_desciption, p.product_img, c.category_name, c.description, i.quantity
    FROM product p
    LEFT JOIN product_category c ON p.category_id = c.category_id
    LEFT JOIN product_inventory i ON p.inventory_id = i.inventory_id
    WHERE p.product_id = ?`;
    var values: Array<string> = [productid];

    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        resolve(result);
      })
      .catch((err: any) => {
        logger.error("get data product err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function add_data_product(req: any) {
  return new Promise((resolve: any) => {
    var sql: string = `INSERT INTO product(product_name, product_img, price, category_id, inventory_id, product_desciption, create_date) 
    VALUES(?, ?, ?, ?, ?, ?, ?)`;
    var values: Array<string | number> = [
      req.body.product_name,
      req.body.product_img,
      req.body.price,
      req.body.category_id,
      req.body.inventory_id,
      req.body.product_desciption,
      moment().format("YYYY/MM/DD HH:mm:ss"),
    ];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        logger.info(
          "add data product date : " + moment().format("YYYY/MM/DD HH:mm:ss")
        );
        resolve({ status: "success", msg: "add product success" });
      })
      .catch((err: any) => {
        logger.error("add data product  err : " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function edit_data_product(req: any, product_id: string) {
  return new Promise((resolve: any) => {
    var sql: string = `UPDATE product 
    SET product_name = ?, product_img = ?, price = ?, category_id = ?, inventory_id = ?, product_desciption = ?, modified_date = ?  
    WHERE product_id = ?`;
    var values: Array<string | number> = [
      req.body.product_name,
      req.body.product_img,
      req.body.price,
      req.body.category_id,
      req.body.inventory_id,
      req.body.product_desciption,
      moment().format("YYYY/MM/DD HH:mm:ss"),
      product_id,
    ];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        logger.info(
          "edit data user username : " +
            product_id +
            " date : " +
            moment().format("YYYY/MM/DD HH:mm:ss")
        );
        resolve({ status: "success", msg: "edit product success" });
      })
      .catch((err: any) => {
        logger.error("edit data username err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function delete_data_user(req: any, product_id: string) {
  return new Promise((resolve: any) => {
    var sql: string = `DELETE FROM product WHERE product_id = ?`;
    var values: Array<string | number> = [product_id];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        logger.info(
          "delete data user username : " +
            product_id +
            " date : " +
            moment().format("YYYY/MM/DD HH:mm:ss")
        );
        resolve({ status: "success", msg: "delete product success" });
      })
      .catch((err: any) => {
        logger.error("delete data product err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export default router;
