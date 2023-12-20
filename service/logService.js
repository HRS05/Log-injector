const express = require("express");
require("dotenv").config();
const { kafka } = require("../connection");

const logService = () => {
  return {
    queueLog: async (data) => {
      const producer = kafka.producer();
      await producer.connect();

      const message = {
        value: JSON.stringify(data),
      };

      const topic = "quickstart-events";

      await producer.send({
        topic,
        messages: [message],
      });
      return { result: "data logged" };
    },

    getlogs: async (filter, clickhouse) => {
      let rows = [];
      const statement = prepareQuery({
       filter
      });
      let stream = clickhouse.query(statement);
      const promise = new Promise((resolve, reject) => {
        stream.on("data", (row) => rows.push(row));
        stream.on("end", () => resolve(rows));
        stream.on("error", (err) => reject(err));
      });
      const res = await promise;
      return { result: "data logged", data: res };
    },
  };
};

const prepareQuery = ({ filter }) => {
  let query = `SELECT * FROM loging.logs `;

  const myArray = getArray(filter);
  if (myArray.length > 0) query += ' WHERE ';

  for (let i = 0; i < myArray.length; i++) {
    query += myArray[i];
    if (myArray.length - 1 != i) query += " AND ";
  }
  return query;
};

const getArray = (filter) => {
  const arr = [];
  if (filter.userId) arr.push(` userId = '${filter.userId}' `);
  if (filter.level) arr.push(` level = '${filter.level}' `);
  if (filter.message) arr.push(` message = '${filter.message}' `);
  if (filter.resourceId) arr.push(` resourceId = '${filter.resourceId}' `);
  if (filter.spanId) arr.push(` spanId = '${filter.spanId}' `);
  if (filter.commit) arr.push(` commit = '${filter.commit}' `);
  if (filter.parentResourceId)
    arr.push(` parentResourceId = '${filter.parentResourceId}' `);
  if (filter.start) arr.push(` timestamp >= '${convertToCustomFormat(filter.start)}' `);
  if (filter.end) arr.push(` timestamp <= '${convertToCustomFormat(filter.end)}' `);
  return arr;
};

function convertToCustomFormat(dateTimeString) {
  const inputDate = new Date(dateTimeString);
  const formattedDate = inputDate.toISOString().slice(0, 19).replace("T", " ");
  return formattedDate;
}

module.exports = logService;
