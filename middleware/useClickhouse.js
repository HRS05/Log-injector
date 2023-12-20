const jwt = require("jsonwebtoken");
require("dotenv").config();

const config = process.env;
const { getClickHouseInstance } = require('../connection');

const useClickhouse = async (req, res, next) => {
  try {
    const clickhouse = await getClickHouseInstance();
    req.clickhouse = clickhouse;
  } catch (err) {
    return res.status(401).send("Clickhouse connection failed");
  }
  return next();
};

module.exports = useClickhouse;
