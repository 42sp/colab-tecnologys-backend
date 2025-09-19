import { HookContext } from '../../declarations'
import type { Users } from '../users/users.class';

export const saveProfileId = async (context: HookContext) => {
	context.app.service('users').patch(context.params?.user?.id, {
		profile_id: context.result.id,
	})
}

export const fetchWorkerProfiles = async (context: HookContext)=> {

	  const { app, params } = context;

	  const isListingWorkers = params?.query?.list_workers === 'true';

	  if (!isListingWorkers) {
		return context;
	  }

	  try {
		const rolesService = app.service('roles');
		const roleResponse = await rolesService.find({ query: { role_name: 'worker', $limit: 1 } }, params);

		if (roleResponse.data.length === 0) {
		  context.result = [];
		  return context;
		}
		const workerRoleId = roleResponse.data[0].id;

		const usersService = app.service('users');
		const usersResponse = await usersService.find({
		  query: { role_id: workerRoleId, $select: ['id'] },
		  paginate: false,
		}, params)

		if (usersResponse.length === 0) {
		  context.result = [];
		  return context;
		}
		const workerUserIds = usersResponse.map((user: Users) => user.id);

		const profileService = app.service('profile');
		const profilesResponse = await profileService.find({
		  query: {
			user_id: { $in: workerUserIds },
			$select: ['user_id', 'name']
		  },
		  paginate: false,
		}, params);

		context.result = profilesResponse;
	  } catch (error) {
		console.error('Error executing the search for workers:', error);
		throw error;
	  }

	  return context;
	};
