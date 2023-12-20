const { json } = require("express");
const express = require("express");
const router = express.Router();
const logService = require("../service/logService")();

const logController = () => {
  return {
    add: async (req, res) => {
      try {
        const logData = req.body;
        logData.userId = req.user.user_id;
        r = await logService.queueLog(logData);
        return res.status(200).json({ message: r });
      } catch (e) {
        return res.status(400).json({ message: e.message });
      }
    },

    get: async (req, res) => {
      try {
        let filter = {};
        if (req?.body?.level) filter.level = req?.body?.level?.trim();
        if (req?.body?.message) filter.message = req?.body?.message?.trim();
        if (req?.body?.resourceId) filter.resourceId = req?.body?.resourceId?.trim();
        if (req?.body?.start) filter.start = req?.body?.start?.trim();
        if (req?.body?.end) filter.end = req?.body?.end?.trim();
        if (req?.body?.spanId) filter.spanId = req?.body?.spanId?.trim();
        if (req?.body?.commit) filter.commit = req?.body?.commit?.trim();
        if (req?.body?.metadata?.parentResourceId) filter.parentResourceId = req?.body?.metadata?.parentResourceId?.trim();
        filter.userId = req?.user?.user_id;

        r = await logService.getlogs(filter, req.clickhouse);
        return res.status(200).json({ message: r });
      } catch (e) {
        return res.status(400).json({ message: e.message });
      }
    },
  };
};
module.exports = logController;
