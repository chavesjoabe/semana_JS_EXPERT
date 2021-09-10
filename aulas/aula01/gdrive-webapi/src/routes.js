import { logger } from "./logger.js";

export default class routes {
  constructor() {}

  setSocketInstance(io) {
    this.io = io;
  }

  async defaultRoute(req, res) {
    res.end("hello world");
  }

  async options(req, res) {
    res.writeHead(204);
    res.end();
  }

  async post(req, res) {
    logger.info("POST");
    res.end();
  }

  async get(req, res) {
    logger.info("GET");
    res.end();
  }

  async handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const chosen = this[req.method.toLowerCase()] || this.defaultRoute;

    return chosen.apply(this, [req, res]);
  }
}