import dotenv from "dotenv";
dotenv.config();

export default {
  DATABASE: {
    URL: process.env.DATABASE_URL || "",
  },

  REDIS: {
    HOST: process.env.REDIS_HOST || "",
    PORT: Number(process.env.REDIS_PORT) || 0,
    PASSWORD: process.env.REDIS_PASSWORD || "",
  },

  TELEGRAM: {
    TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  },
};
