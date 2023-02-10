import IORedis from "ioredis";
import { Queue, Worker } from "bullmq";

// Connection
const connection = new IORedis(
  process.env.REDIS_CONNECTION ?? "redis://127.0.0.1:56379",
  {
    maxRetriesPerRequest: null,
  }
);

connection.on("error", (err) => console.error(err.message));

// Queue
const queue = new Queue("Test", {
  connection,
  defaultJobOptions: {
    attempts: Number.MAX_SAFE_INTEGER,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

queue.on("error", () => {});

// Worker
const worker = new Worker(
  "Test",
  async (activeJob) => {
    console.log(`Running job: ${activeJob.name}`);
  },
  {
    connection,
    autorun: false,
  }
);

worker.on("error", (err) => console.error(err.message));

// Run test
(async () => {
  await queue.waitUntilReady();
  await queue.obliterate({ force: true });

  void worker.run();
  await worker.waitUntilReady();

  await Promise.all(
    [...Array(1000)].map(async (_, index) => {
      await queue.add(`Test ${index + 1}`, null, {
        delay: index * 10000,
      });
    })
  );
})();
