import * as actions from './actions'
import * as reducers from './reducers'

const dummyFetchJson = (url, options) => ({
	then: (callback) => callback(options.body)
})

describe('reducers', () => {
	describe('project reducer', () => {
		const dummyProject1 = { id: -1 };
		const dummyProject2 = { id: 99 };
		const reducer = (state, action) => reducers.projectReducer(state, action, dummyFetchJson);
		const add = actions.addProject;
		const del = actions.deleteProject;

		it('should add a project', () => {
			expect(reducer([dummyProject1], actions.addProject(dummyProject2)))
				.toEqual([dummyProject1, dummyProject2]);
		});

		it('should delete a project', () => {
			expect(reducer([dummyProject1, dummyProject2], actions.deleteProject(dummyProject1)))
				.toEqual([dummyProject2]);
		});
	});
});