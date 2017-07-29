import * as actions from './actions'
import * as reducers from './reducers'
import store from './store';

describe('store', () => {
	it('project integrationz', () => {
		const dummyProject = { id: -1 };

		expect(store.getState().projects).toEqual([]);

		store.dispatch(actions.addProject(dummyProject));
		expect(store.getState().projects).toEqual([dummyProject]);

		store.dispatch(actions.deleteProject(dummyProject));
		expect(store.getState().projects).toEqual([])
	});
});