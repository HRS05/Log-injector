const { getClickHouseInstance, kafka } = require("../connection");
const consumer = kafka.consumer({ groupId: "your_group_id" });

async function runConsumer() {
  const clickHouse = await getClickHouseInstance();
  const topic = process.env.LOG_TOPIC || 'quickstart-events';
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
    //   console.log({
    //     value: message.value.toString(),
    //   });
      addData(message.value.toString(), clickHouse);
    },
  });
}

function addData(message, clickHouse) {
  const logData = JSON.parse(message);

  const query = `
  INSERT INTO loging.logs
  (level, message, resourceId, timestamp, traceId, spanId, commit, userId, parentResourceId)
  VALUES
  ('${logData.level}', '${logData.message}', '${
    logData.resourceId
  }', '${convertToCustomFormat(logData.timestamp)}', '${logData.traceId}', '${
    logData.spanId
  }', '${logData.commit}', '${logData.userId}', '${
    logData.metadata.parentResourceId
  }')
`;

  clickHouse.query(query, (err, result) => {
    if (err) {
      console.error("Error inserting data into ClickHouse:", err);
    } else {
      console.log("Data inserted into ClickHouse:", result);
    }
  });
}

runConsumer().catch(console.error);

function convertToCustomFormat(dateTimeString) {
  const inputDate = new Date(dateTimeString);
  const formattedDate = inputDate.toISOString().slice(0, 19).replace("T", " ");

  return formattedDate;
}
