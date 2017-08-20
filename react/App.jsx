import React from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import { Provider, dispatch, connect } from 'react-redux';
import { combineReducers, createStore, applyMiddleware  } from 'redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import * as projects from './ducks/project';
import * as organizations from './ducks/organization';
import * as user from './ducks/user';
import * as users from './ducks/users';
import * as comments from './ducks/comments';
import * as debug from './ducks/debug';

import middlewares from './middlewares.js';
import appClient from './util/appClient.js';
import toDict from './util/toDict';

import Home from './components/Home.jsx';
import Projects from './components/Projects.jsx';
import NotFound from './components/NotFound.jsx'
import Chat from './components/Chat.jsx';
import Layout from './components/Layout.jsx';
import Debugger from './components/Debugger.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';

class LazyLoaderCache {
    keysLoaded = {};

    startLazyLoad(key, load) {
        if (this.keysLoaded[key])
            return;

        console.log('Lazy loading key '+key);
        this.keysLoaded[key] = true;
        load();
        console.log('Called load '+key);        
    }
}

class UserRepository {
    constructor(users, cache) {
        this.users = users;
        this.cache = cache;
    }

    getOrLazyLoad(id, lazyLoad) {
        if (this.users[id])
            return this.users[id];

        this.cache.startLazyLoad(id, () => lazyLoad(id));
        return {
            id,
            name: 'loading...',
            alias: 'loading...'
        };
    }
}

const userLazyLoaderCache = new LazyLoaderCache();

const history = createHistory({
    basename: '/app',
});
const store = createStore(
    combineReducers({
        user: (state, action) => user.default(state, action, appClient),
        users: (state, action) => users.default(state, action, appClient),
        projects: (state, action) => projects.default(state, action, appClient),
        organizations: (state, action) => organizations.default(state, action, appClient),
        comments: (state, action) => comments.default(state, action, appClient),
        debug: debug.default,
        routing: routerReducer,
    }),
    applyMiddleware(
        routerMiddleware(history),
        //middlewares.actionLogMiddleware,
        middlewares.asyncDispatchMiddleware
    )
);

const SProjects = connect(
    (state, ownProps) => {
        return {
            organizations: state.organizations,
            projects: state.projects,
            projectId: ownProps.projectId,
            users: state.users,
            comments: (ownProps.projectId && state.comments.byProjectId[ownProps.projectId]) || [],
            userRepository: new UserRepository(state.users, userLazyLoaderCache),
        };
    },
    (dispatch) => ({
        onLoad: (organizationToken) => {
            dispatch(organizations.getOrganization(organizationToken));
            dispatch(projects.getOrganizationProjects(organizationToken));
        },
        onCreateProject: (project) => {
            dispatch(projects.createProject(project));
        },
        getProjectData: (projectId) => {
            dispatch(comments.getProjectComments(projectId));
        },
        getChildrenProjects: (organizationToken, parentProjectId) => {
            dispatch(projects.getOrganizationProjects(organizationToken, parentProjectId));
        },
        postComment: (projectId, content) => {
            dispatch(comments.postProjectComment(projectId, content));
        },
        lazyLoadUser: (id) => {
            dispatch(users.getUser(id));
        }
    }),
)(Projects);

const SChat = connect(
    (state) => ({
        organizations: state.organizations,
        projects: state.projects
    }),
    (dispatch) => ({
    }),
)(Chat);

const SLayout = connect(
    (state) => ({
        projects: state.projects,
        chatChannels: [],
    }),
    (dispatch) => ({
        getProjects: (orgToken) => {
            dispatch(projects.getOrganizationProjects(orgToken));
        }
    })
)(Layout);

const SDebugger = connect(
    (state) => {
        let { debug, ...coreState } = state;

        return {
            state: coreState,
            actionHistory: debug.actionHistory
        };
    },
)(Debugger);

const debugEnabled = true;

const App = () => {
    return <Provider store={store}>
        <div className="app-container">
            <ConnectedRouter history={history}>
                <div className="app-container">
                    <Switch>
                        <Route exact path="/" component={connect(
                            (state)  => ({
                                user: state.user,
                            }),
                            (dispatch) => ({
                                onLoad: () => dispatch(user.getCurrentUser()),
                                createOrganization: (org) => dispatch(organizations.createOrganization(org))
                            })
                        )(Home)} />
                        <Route exact path="/settings" component={SettingsPanel} />
                        <Route path="/:org" component={(x) =>
                            (<SLayout organizationToken={x.match.params.org}>
                                <Route exact path={x.match.url+'/projects'} component={(y) =>
                                    (<SProjects organizationToken={x.match.params.org} />)
                                } />
                                <Route path={x.match.url+'/projects/:projectId'} component={(y) =>
                                    (<SProjects organizationToken={x.match.params.org} projectId={y.match.params.projectId} />)
                                } />
                                <Route path={x.match.url+'/chat/:channel'} component={(y) =>
                                    (<SChat organizationToken={x.match.params.org} channel={y.match.params.channel} />)
                                } />
                            </SLayout>)
                        } />
                        <Route path='/*' component={NotFound} />
                    </Switch>
                </div>
            </ConnectedRouter>
            {debugEnabled ? <SDebugger /> : null}
        </div>
    </Provider>
};

export default App;