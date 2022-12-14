import { configs } from "../../configs.ts";
import { PrismaClient } from "../../deps.ts";
import { logger } from "../utils/logger.ts";

const log = logger({ name: "DB Manager" });

log.info("Initializing Database");

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: configs.database_url,
    },
  },
});

log.info("Database Initialized!");
