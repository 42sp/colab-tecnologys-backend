import { HookContext } from '@feathersjs/feathers';

export const logSql = (context: HookContext) => {
    const logger = context.app.get('logger') || console;
    
    const knexClient = context.service.Model; 

    if (knexClient && knexClient.client && knexClient.client.on) {
        
        knexClient.client.once('query', (queryData: any) => {
            logger.info(`KNEX QUERY: ${context.service.path}.${context.method}`);
            logger.info('SQL:', queryData.sql);
            logger.info('BINDINGS:', queryData.bindings);
        });
    } else {
         logger.warn(`logSql hook: Knex client not found for service ${context.path}`);
    }
    
    return context;
};