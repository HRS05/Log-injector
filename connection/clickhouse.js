const Clickhouse = require("@apla/clickhouse");
let clickHouse = null;
const config = {
  host: process.env.CLICKHOUSE_HOST || "localhost",
  port: process.env.CLICKHOUSE_PORT || 8123,
  user: process.env.CLICKHOUSE_USER || "default",
  password: process.env.CLICKHOUSE_PASSWORD || "",
};

const getClickhouse = async ({ host, user, password }) => {
  const config = { host, user, password, format: "JSON" };
  const clickHouse = new Clickhouse(config);
  return clickHouse;
};

const initializeClickhouse = async () => {
  try {
    clickHouse = await getClickhouse(config);
    console.log("ClickHouse connected successfully");
  } catch (error) {
    throw new Error(`Clickhouse connection failed: ${error}`);
  }
};

initializeClickhouse();

module.exports = async () => {
  // Ensure that clickHouse is initialized before exporting
  if (!clickHouse) {
    await initializeClickhouse();
  }
  return clickHouse;
};
