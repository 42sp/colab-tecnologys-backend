import type { HookContext } from '../declarations';
//import winston from 'winston';


// const logger = winston.createLogger({
//   level: 'debug',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(
//       ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
//     )
//   ),
//   transports: [new winston.transports.Console()],
// });

export const applyFiltersAndLike = () => {
  return async (context: HookContext) => {
    const { query } = context.params;
    //logger.debug(`applyFiltersAndLike hook - query original: ${JSON.stringify(query)}`);

    if (!query) return context;
    if (query.status) {
      const statusValue = query.status;
      delete query.status;


      const now = new Date().toISOString();

      switch (statusValue) {
        case 'Concluído':
          query.finished_at = { $ne: null };
          break;
        case 'Atrasado':
          query.finished_at = null;
          query.expected_end_date = { $lt: now };
          break;
        case 'Em Andamento':
          query.finished_at = null;
          query.expected_end_date = { $gte: now };
          break;
      }
    }

    Object.keys(query).forEach((key) => {
      const value = query[key];
      if (key === 'name' && typeof value === 'string' && value.includes('%')) {
        query[key] = { $ilike: value };
        //logger.debug(`applyFiltersAndLike hook - campo LIKE modificado: ${key} -> ${JSON.stringify(query[key])}`);
      }
    });

    //logger.debug(`applyFiltersAndLike hook - query final: ${JSON.stringify(query)}`);
    return context;
  };
};