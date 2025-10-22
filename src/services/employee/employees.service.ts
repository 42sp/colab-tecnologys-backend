// import { hooks as schemaHooks } from '@feathersjs/schema';
// import type { Application, HookContext } from '../../declarations';
// import { BadRequest, GeneralError } from '@feathersjs/errors';

// export const employeesPath = 'employees';
// export const employeesMethods = ['create'];

// const patchEmployee = async (context: HookContext) => {
//     const { id, data, app, params } = context;

//     // --- 1. SEPARAÇÃO DOS DADOS ---
//     // Os dados do formulário (data) serão FullEmployeeProfile.
//     // Precisamos separar os campos que pertencem a 'users' e 'profile'.
    
//     // Campos que pertencem à tabela `users` (Acesso e Status)
//     const userDataToPatch: Record<string, any> = {};
//     const userFields = ['cpf', 'is_active', 'is_available']; // Adicione outros campos de User aqui, se necessário.

//     // Campos que pertencem à tabela `profile` (Detalhes Pessoais)
//     const profileDataToPatch: Record<string, any> = {};
//     const profileFields = [
//         'name', 'email', 'phone', 'role_id', 'date_of_birth', 
//         'address', 'city', 'state', 'postcode'
//     ]; 
//     // Certifique-se de que os campos do Profile não incluam 'user_id' e 'id' na atualização,
//     // pois o Feathers Patch usa o 'id' do contexto.

//     // Itera sobre o payload recebido e distribui os dados
//     for (const key in data) {
//         if (userFields.includes(key)) {
//             userDataToPatch[key] = data[key];
//         } else if (profileFields.includes(key)) {
//             profileDataToPatch[key] = data[key];
//         }
//         // Campos irrelevantes (como 'password') são ignorados, mas você pode adicioná-los 
//         // a uma lista de ignore list se necessário.
//     }
    
//     // O Feathers Knex usa o 'id' do contexto para o patch.
//     const userId = id; 
//     const profileId = id; // O Profile.id é igual ao User.id

//     try {
//         const promises = [];

//         // --- 2. PATCH NO SERVIÇO 'users' ---
//         if (Object.keys(userDataToPatch).length > 0) {
//             promises.push(
//                 app.service('users').patch(userId, userDataToPatch, params)
//             );
//         }

//         // --- 3. PATCH NO SERVIÇO 'profile' ---
//         if (Object.keys(profileDataToPatch).length > 0) {
//             promises.push(
//                 app.service('profile').patch(profileId, profileDataToPatch, params)
//             );
//         }

//         await Promise.all(promises);

//         // --- 4. RETORNO (Opcional: Re-buscar dados completos) ---
//         // Retornar o registro atualizado completo para o frontend
//         const updatedEmployee = await app.service('employees').get(id, params); 
//         context.result = updatedEmployee;

//         return context;
        
//     } catch (error: any) {
//         console.error('Erro durante o PATCH orquestrado:', error.message);
//         throw new GeneralError('Falha ao atualizar funcionário.', { originalError: error.message });
//     }
// };

// // Hook de orquestração para criar User e Profile em uma única transação lógica
// const createEmployee = async (context: HookContext) => {
//     const data = context.data;
//     const app = context.app;
    
//     // Armazena o ID do usuário para uso no Profile e no Rollback
//     let newUserId: string | undefined;

//     // --- 1. PREPARAR PAYLOADS ---
    
//     // Payload para o serviço 'users'
//     const userData = {
//         cpf: data.cpf,
//         password: data.password, 
//     };

//     // Payload para o serviço 'profile'
//     const profileData = {
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         role_id: data.role_id,
//         date_of_birth: data.date_of_birth,
//         address: data.address,
//         city: data.city,
//         state: data.state,
//         postcode: data.postcode,
//         photo: data.photo || '', // Garante que é string vazia para validação
//     };

//     try {
//         console.info('[Employees Service] Enviando payload para Users:', { 
//             ...userData, 
//             password: '***'
//         });

//         // --- 2. CHAMAR O SERVIÇO 'users' ---
//         const userResult = await app.service('users').create(userData, context.params);
        
//         newUserId = userResult.id; 
        
//         console.info(`[Employees Service] Usuário criado com ID: ${newUserId}`);

//         // --- 3. CHAMAR O SERVIÇO 'profile' ---
//         // O ID do perfil é o mesmo ID do usuário (relacionamento one-to-one)
//         const finalProfilePayload = {
//             id: newUserId,
//             ...profileData,
//             user_id: newUserId,
//         };
        
//         console.info('[Employees Service] Payload final para Profile:', finalProfilePayload);

//         const profileResult = await app.service('profile').create(finalProfilePayload, context.params);
        
//         console.info(`[Employees Service] Perfil criado para user_id: ${newUserId}`);

//         // --- 4. RETORNO FINAL ---
//         context.result = {
//             ...userResult,
//             profile: profileResult,
//         };

//         return context;
        
//     } catch (error: any) {
//         // LÓGICA DE ROLLBACK: Remove o usuário criado se a criação do perfil falhar
//         if (newUserId) { 
//             await app.service('users').remove(newUserId, { ...context.params, internal: true });
//             console.warn(`[Employees Service] ROLLBACK: Usuário ${newUserId} removido após falha na criação do perfil.`);
//         }
        
//         console.error('Erro durante a criação orquestrada:', error.message);
//         throw new GeneralError('Falha ao registrar funcionário.', { originalError: error.message });
//     }
// };


// // Configuração do serviço de orquestração
// export const employees = (app: Application) => {
//     // Registra o serviço sem uma classe de banco de dados, a lógica está no hook 'createEmployee'
//     app.use(employeesPath, {
//         async create(data: any) {
//             return data;
//         },
//     }, {
//         methods: employeesMethods,
//         events: [],
//     });

//     // Inicializa hooks
//     app.service(employeesPath).hooks({
//         after: {
//             create: [createEmployee] 
//         },
//         around: {
//             all: [
//                 // Hooks de segurança (autenticação/permissão)
//             ],
//         },
//         error: {
//             all: []
//         }
//     });
// };

// declare module '../../declarations' {
//     interface ServiceTypes {
//         [employeesPath]: any 
//     }
// }