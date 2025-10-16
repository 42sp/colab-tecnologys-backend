// backend/src/shared-types.ts

// 1. Importa os tipos internos do Backend (usa 'type' para garantir que é só tipagem)
import type { Constructions } from './services/constructions/constructions.schema'; 
import type { Users } from './services/users/users.schema'; 
// Adicione aqui todos os tipos de dados (schemas) que o Frontend consome


// 2. Define e Exporta a Tipagem do Objeto (o que o Feathers retorna)
// Usamos 'Constructions' como base e estendemos, se necessário.
// Esta interface *é* a tipagem da construção que o Frontend verá.
export interface Construction extends Constructions {} 
// export interface User extends Users {} 
// Adicione os exports dos outros objetos aqui.


// 3. Define e Exporta o Mapa de Serviços (ServiceTypes)
// Este é o mapa que o Feathers Client usa para tipar o .service('nome')
export interface ServiceTypes {
  'constructions': Construction; // Mapeia o serviço 'constructions' para o tipo Construction
  'users': Users;
  // 'tasks': Task;
}