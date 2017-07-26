import * as actions from './actions'
import * as reducers from './reducers'
import store from './store';

describe('actions', ()=> {
	describe('project actions', () => {
		it('should pass a basic test', () => {
			expect(3).toEqual(3)
		});

		it('should build actions correctly', () => {
			const dummyProject = -99;
			expect(actions.addProject(dummyProject))
				.toEqual({type: actions.ADD_PROJECT, project: dummyProject});
			expect(actions.deleteProject(dummyProject))
				.toEqual({type: actions.DELETE_PROJECT, project: dummyProject});
		});
	});
})

describe('reducers', () => {
	describe('project reducer', () => {
		const dummyProject1 = { id: -1 };
		const dummyProject2 = { id: 99 };
		const r = reducers.projectReducer;
		const add = actions.addProject;
		const del = actions.deleteProject;

		it('should add a project', () => {
			expect(r([dummyProject1], add(dummyProject2)))
				.toEqual([dummyProject1, dummyProject2]);
		});

		it('should delete a project', () => {
			expect(r([dummyProject1, dummyProject2], del(dummyProject1)))
				.toEqual([dummyProject2]);
		});
	});
});

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