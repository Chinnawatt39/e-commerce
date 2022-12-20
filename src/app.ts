import express, { Application } from "express";
import * as bodyParser from "body-parser";
import { WinstonLogger } from "./libs/logger";
import { Logger } from "winston";
//config
import config from "./config/config.json";
const logger: Logger = WinstonLogger(__filename, config.log);

//authentication
//user_magement
import user from "./route/user_management";
//autencation
import authentication from "./route/authentication";
//product
import product from "./route/product_management";
//order
import orders from "./route/order_management";
export async function index() {
  const app = new App();
}

export class App {
  private app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.setting();
    this.listen();
    this.config();
    this.routes();
  }
  routes() {
    this.app.use("/user", user);
    this.app.use("/authentication", authentication);
    this.app.use("/product", product);
    this.app.use("/orders", orders);
  }

  setting() {
    this.app.set(
      "port",
      this.port || process.env.PORT || config.app.port || 8001
    );
  }

  async listen() {
    await this.app.listen(this.app.get("port"));
    logger.info("Server runing port :  " + this.app.get("port"));
  }

  private config(): void {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

index();
