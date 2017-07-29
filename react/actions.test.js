import * as actions from './actions'

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