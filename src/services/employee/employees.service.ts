import { hooks as schemaHooks } from '@feathersjs/schema';
import type { Application, HookContext } from '../../declarations';
import { BadRequest, GeneralError } from '@feathersjs/errors';

export const employeesPath = 'employees';
export const employeesMethods = ['create'];

// Hook de orquestração para criar User e Profile em uma única transação lógica
const createEmployee = async (context: HookContext) => {
    const data = context.data;
    const app = context.app;
    
    // Armazena o ID do usuário para uso no Profile e no Rollback
    let newUserId: string | undefined;

    // --- 1. PREPARAR PAYLOADS ---
    
    // Payload para o serviço 'users'
    const userData = {
        cpf: data.cpf,
        password: data.password, 
    };

    // Payload para o serviço 'profile'
    const profileData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role_id: data.role_id,
        date_of_birth: data.date_of_birth,
        address: data.address,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        photo: data.photo || '', // Garante que é string vazia para validação
    };

    try {
        console.info('[Employees Service] Enviando payload para Users:', { 
            ...userData, 
            password: '***'
        });

        // --- 2. CHAMAR O SERVIÇO 'users' ---
        const userResult = await app.service('users').create(userData, context.params);
        
        newUserId = userResult.id; 
        
        console.info(`[Employees Service] Usuário criado com ID: ${newUserId}`);

        // --- 3. CHAMAR O SERVIÇO 'profile' ---
        // O ID do perfil é o mesmo ID do usuário (relacionamento one-to-one)
        const finalProfilePayload = {
            id: newUserId,
            ...profileData,
            user_id: newUserId,
        };
        
        console.info('[Employees Service] Payload final para Profile:', finalProfilePayload);

        const profileResult = await app.service('profile').create(finalProfilePayload, context.params);
        
        console.info(`[Employees Service] Perfil criado para user_id: ${newUserId}`);

        // --- 4. RETORNO FINAL ---
        context.result = {
            ...userResult,
            profile: profileResult,
        };

        return context;
        
    } catch (error: any) {
        // LÓGICA DE ROLLBACK: Remove o usuário criado se a criação do perfil falhar
        if (newUserId) { 
            await app.service('users').remove(newUserId, { ...context.params, internal: true });
            console.warn(`[Employees Service] ROLLBACK: Usuário ${newUserId} removido após falha na criação do perfil.`);
        }
        
        console.error('Erro durante a criação orquestrada:', error.message);
        throw new GeneralError('Falha ao registrar funcionário.', { originalError: error.message });
    }
};


// Configuração do serviço de orquestração
export const employees = (app: Application) => {
    // Registra o serviço sem uma classe de banco de dados, a lógica está no hook 'createEmployee'
    app.use(employeesPath, {
        async create(data: any) {
            return data;
        },
    }, {
        methods: employeesMethods,
        events: [],
    });

    // Inicializa hooks
    app.service(employeesPath).hooks({
        after: {
            create: [createEmployee] 
        },
        around: {
            all: [
                // Hooks de segurança (autenticação/permissão)
            ],
        },
        error: {
            all: []
        }
    });
};

declare module '../../declarations' {
    interface ServiceTypes {
        [employeesPath]: any 
    }
}