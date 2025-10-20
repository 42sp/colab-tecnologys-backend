// src/hooks/apply-like.ts

import type { HookContext } from '../declarations';
import winston from 'winston';

// Configuração do logger (mantida)
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

// [NOVA FUNÇÃO] Hook que aplica filtros virtuais e a busca por LIKE
export const applyFiltersAndLike = () => {
  return async (context: HookContext) => {
    const { query } = context.params;
    logger.debug(`applyFiltersAndLike hook - query original: ${JSON.stringify(query)}`);

    if (!query) return context;

    // --- 1. TRATAMENTO DO FILTRO DE STATUS VIRTUAL ---
    if (query.status) {
      const statusValue = query.status;
      // Remove o status para não ser tratado como coluna real
      delete query.status;

      // Obtém a data atual em formato ISO para comparações no banco de dados
      const now = new Date().toISOString();

      switch (statusValue) {
        case 'Concluído':
          // finished_at não nulo (o Feathers/Knex traduz $ne: null para IS NOT NULL)
          query.finished_at = { $ne: null };
          break;
        case 'Atrasado':
          // finished_at é nulo E expected_end_date é menor que agora
          query.finished_at = null;
          query.expected_end_date = { $lt: now };
          break;
        case 'Em Andamento':
          // finished_at é nulo E expected_end_date é maior ou igual a agora
          // Nota: Assumimos que 'Em Andamento' significa que não foi finalizado e o prazo ainda não passou
          query.finished_at = null;
          query.expected_end_date = { $gte: now };
          break;
      }
    }

    // --- 2. TRATAMENTO DA BUSCA POR NOME (LIKE) ---
    Object.keys(query).forEach((key) => {
      const value = query[key];
      // Aplicamos $like/ilike apenas ao campo 'name' (ou outros que usam '%')
      // para evitar aplicar a operadores de data que foram definidos acima
      if (key === 'name' && typeof value === 'string' && value.includes('%')) {
        // Usamos $ilike para busca insensível a maiúsculas/minúsculas no PostgreSQL
        query[key] = { $ilike: value };
        logger.debug(`applyFiltersAndLike hook - campo LIKE modificado: ${key} -> ${JSON.stringify(query[key])}`);
      }
    });

    logger.debug(`applyFiltersAndLike hook - query final: ${JSON.stringify(query)}`);
    return context;
  };
};