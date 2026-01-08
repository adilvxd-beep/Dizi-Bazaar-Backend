import { createClient } from "redis";
import { env } from "../../config/index.js";

const client = createClient({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

export default client;
