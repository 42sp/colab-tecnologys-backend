import type { HookContext } from '../declarations';
import winston from 'winston';


const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

export const applyLike = () => {
  return async (context: HookContext) => {
    const { query } = context.params;
    logger.debug(`applyLike hook - query original: ${JSON.stringify(query)}`);

    if (!query) return context;

    Object.keys(query).forEach((key) => {
      const value = query[key];
      if (typeof value === 'string' && value.includes('%')) {
        query[key] = { $like: value };
        logger.debug(`applyLike hook - campo modificado: ${key} -> ${JSON.stringify(query[key])}`);
      }
    });

    logger.debug(`applyLike hook - query final: ${JSON.stringify(query)}`);
    return context;
  };
};
