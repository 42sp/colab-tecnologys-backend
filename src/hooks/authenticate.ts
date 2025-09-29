import { authenticate } from '@feathersjs/authentication';
import { HookContext } from '../declarations';

export const byPassAuth = async (context: HookContext) => {

    if(context.data?.id){
        return context;
    }else{
        return authenticate('jwt')(context);
    }
	
}
 