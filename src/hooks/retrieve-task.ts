// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

// MELHORIA DE PROCESSO COLOCANDO REDIS

export const retrieveTask = async (context: HookContext) => {
  console.log(`Running hook retrieve-task on ${context.path}.${context.method}`)
  console.log('data', context.result, context.data, context.params)

  

  const { result, app } = context;
  const data = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [result];

  // Filter properties service
  const serviceIds = [...new Set(data.map((t: any) => t.service_id))];
  const services = await app.service('services').find({
    paginate: false,
    query: { id: { $in: serviceIds } }
  });
  const map = Object.fromEntries(services.map((s: any) => [s.id, s]));

  for (const task of data) {
    const service = map[task.service_id];
    if (service) {
      task.service_tower = service.tower;
      task.service_apartment = service.apartment;
      task.service_floor = service.floor;
      task.service_stage = service.stage;
      task.work_id = service.work_id;
      task.service_type_id = service.service_type_id;
    }
  }



  // Filter properties worker
  const workerIds = [...new Set(data.map((t: any) => t.worker_id))];

  const cleaned = workerIds.filter(item => item !== null);
  const workers = await app.service('profile').find({
    paginate: false,
    query: { id: { $in: cleaned } }
  });
  const map_workers = Object.fromEntries(workers.map((s: any) => [s.id, s]));

  for (const w of data) {
    const worker = map_workers[w.worker_id];
    if (worker) {
      w.worker_name = worker.name;
    }
  }


  // Filter properties construction
  const constructionIds = [...new Set(data.map((t: any) => t.work_id))];
  const constructions = await app.service('constructions').find({
    paginate: false,
    query: { id: { $in: constructionIds } }
  });
  const map_constructions = Object.fromEntries(constructions.map((s: any) => [s.id, s]));

  for (const c of data) {
    const construction = map_constructions[c.work_id];
    if (construction) {
      c.construction_name = construction.name;
    }
  }

  // Filter properties construction
  const serviceTypeIds = [...new Set(data.map((t: any) => t.service_type_id))];
  const serviceTypes = await app.service('service-types').find({
    paginate: false,
    query: { id: { $in: serviceTypeIds } }
  });
  const map_serviceTypes = Object.fromEntries(serviceTypes.map((s: any) => [s.id, s]));

  for (const s of data) {
    const service = map_serviceTypes[s.service_type_id];
    if (service) {
      s.service_type = service.service_name;
    }
  }

  console.log('data after join', data);

  //const keysToKeep = ['stage', 'floor', 'apartment', 'tower', 'task_percentage', 'worker_id', 'status', 'completion_date', 'service_id', 'id', 'worker_name', 'construction_name']; 
  const keysToRemove = ['service_type_id', 'work_id', 'construction_address', 'updated_at', 'created_at', 'worker_id', 'service_id']; 

  const objects = data.map((data: any) => {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => !keysToRemove.includes(key))
    );
  });

  context.result = objects;

  return context
}


/*
{
  service_id: '84b69dee-5047-4fc4-982f-7a7bb0815dc7',
  completion_date: '2025-09-24',
  task_percentage: 100,
  worker_id: '41143893-39b4-4e15-8b65-cff53ae2d889',
  status: 'pending',
  id: '6c2d67b2-dc00-476f-aff0-dac63ff44125'
}
  */