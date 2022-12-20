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

router.post("/get/order/history/:username", async function (req, res) {
  res.json(await get_data_order_by_username(req.params.username));
});

router.post("/get/data/:order_id", async function (req, res) {
  res.json(await get_data_order_by_order_id(req.params.order_id));
});

router.post("/add/data", async function (req, res) {
  const order_id: any = await add_data_order(req);
  const inventory_id: any = await select_product_inventory(req.body.product_id);
  update_data_inventory(inventory_id, req.body.quantity);
  res.json(await add_data_payment(req, order_id));
});

router.post("/cancel/:order_id", async function (req, res) {
  const order: any = await select_product_order(req.params.order_id);
  update_data_inventory_cancel(order[0].inventory_id, order[0].quantity);
  res.json(await update_data_order_cancel(req.params.order_id));
});

export async function get_data_order_by_username(username: string) {
  return new Promise((resolve: any) => {
    var sql: string = `SELECT p.product_name, o.total, p.price, pm.amount, s.status_name
    FROM orders o
    LEFT JOIN product p ON o.product_id = p.product_id
    LEFT JOIN payment_detail pm ON o.order_id = pm.order_id
    LEFT JOIN order_status s ON o.status_id = s.status_id
    WHERE o.username = ?`;
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
        logger.error("get data product err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function get_data_order_by_order_id(order_id: string) {
  return new Promise((resolve: any) => {
    var sql: string = `SELECT p.product_name, o.total, p.price, pm.amount, s.status_name
      FROM orders o
      LEFT JOIN product p ON o.product_id = p.product_id
      LEFT JOIN payment_detail pm ON o.order_id = pm.order_id
      LEFT JOIN order_status s ON o.status_id = s.status_id
      WHERE o.order_id = ?`;
    var values: Array<string> = [order_id];

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

export async function add_data_order(req: any) {
  return new Promise((resolve: any) => {
    var sql: string = `INSERT INTO orders(username, product_id, quantity, total) 
    VALUES(?, ?, ?, ?)`;
    var values: Array<string | number> = [
      req.body.username,
      req.body.product_id,
      req.body.quantity,
      req.body.total,
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
        resolve(result.insertId);
      })
      .catch((err: any) => {
        logger.error("add data product  err : " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function add_data_payment(req: any, order_id: number) {
  return new Promise((resolve: any) => {
    var sql: string = `INSERT INTO payment_detail(amount, order_id) 
    VALUES(?, ?)`;
    var values: Array<string | number> = [req.body.amount, order_id];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        logger.info(
          "add data product date : " + moment().format("YYYY/MM/DD HH:mm:ss")
        );
        resolve({ status: "success", msg: "add order success" });
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

export async function update_data_inventory(
  inventory_id: string,
  quantity: number
) {
  return new Promise((resolve: any) => {
    var sql: string = `UPDATE product_inventory SET quantity = quantity - ? , modified_date = ?
    WHERE inventory_id = ?`;
    var values: Array<string | number> = [
      quantity,
      moment().format("YYYY/MM/DD HH:mm:ss"),
      inventory_id,
    ];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        resolve({ status: "success", msg: "update product inventory success" });
      })
      .catch((err: any) => {
        logger.error("edit data product inventory err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function select_product_inventory(product_id: number) {
  return new Promise((resolve: any) => {
    var sql: string = `SELECT product_id, inventory_id FROM product WHERE product_id = ?`;
    var values: Array<number> = [product_id];
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
        resolve(result[0].inventory_id);
      })
      .catch((err: any) => {
        logger.error("edit data username err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function select_product_order(order_id: string) {
  return new Promise((resolve: any) => {
    var sql: string = `SELECT o.product_id, o.quantity, i.inventory_id
    FROM orders o
    LEFT JOIN product_inventory i ON o.product_id = i.inventory_id
    WHERE o.order_id = ?`;
    var values: Array<string> = [order_id];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        resolve(result);
      })
      .catch((err: any) => {
        logger.error("data select product order err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function update_data_inventory_cancel(
  inventory_id: string,
  quantity: number
) {
  return new Promise((resolve: any) => {
    var sql: string = `UPDATE product_inventory SET quantity = quantity + ? , modified_date = ?
      WHERE inventory_id = ?`;
    var values: Array<string | number> = [
      quantity,
      moment().format("YYYY/MM/DD HH:mm:ss"),
      inventory_id,
    ];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        resolve({ status: "success", msg: "update product inventory success" });
      })
      .catch((err: any) => {
        logger.error("edit data product inventory err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export async function update_data_order_cancel(order_id: string) {
  return new Promise((resolve: any) => {
    var sql: string = `UPDATE orders SET status_id=3 WHERE order_id = ?`;
    var values: Array<string | number> = [order_id];
    conect
      .query({
        sql: sql,
        values: values,
      })
      .then(([result, fields]: any) => {
        resolve({ status: "success", msg: "cancel order success" });
      })
      .catch((err: any) => {
        logger.error("edit data product inventory err: " + err);
        resolve({ status: "error", msg: err });
      });
  });
}

export default router;
