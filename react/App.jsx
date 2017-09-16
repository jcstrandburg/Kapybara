import React from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import { Provider, dispatch, connect } from 'react-redux';
import { combineReducers, createStore, applyMiddleware  } from 'redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import projects from './ducks/project';
import organizations from './ducks/organization';
import user from './ducks/user';
import users from './ducks/users';
import comments from './ducks/comments';
import debug from './ducks/debug';

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

        this.keysLoaded[key] = true;
        load();
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
        user: user.getReducer(appClient),
        users: users.getReducer(appClient),
        projects: projects.getReducer(appClient),
        organizations: organizations.getReducer(appClient),
        comments: comments.getReducer(appClient),
        debug: debug.reducer,
        routing: routerReducer,
    }),
    applyMiddleware(
        routerMiddleware(history),
        middlewares.asyncDispatchMiddleware
    )
);

const ConnectedProjects = connect(
    (state, ownProps) => ({
        organizations: state.organizations,
        projects: state.projects,
        projectId: ownProps.projectId,
        users: state.users,
        comments: (ownProps.projectId && state.comments.byProjectId[ownProps.projectId]) || [],
        userRepository: new UserRepository(state.users, userLazyLoaderCache),
    }),
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

const ConnectedChat = connect(
    (state) => ({
        organizations: state.organizations,
        projects: state.projects
    }),
    (dispatch) => ({
    }),
)(Chat);

const ConnectedLayout = connect(
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

const ConnectedDebugger = connect(
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
                            (<ConnectedLayout organizationToken={x.match.params.org}>
                                <Route exact path={x.match.url+'/projects'} component={(y) =>
                                    (<ConnectedProjects organizationToken={x.match.params.org} />)
                                } />
                                <Route path={x.match.url+'/projects/:projectId'} component={(y) =>
                                    (<ConnectedProjects organizationToken={x.match.params.org} projectId={y.match.params.projectId} />)
                                } />
                                <Route path={x.match.url+'/chat/:channel'} component={(y) =>
                                    (<ConnectedChat organizationToken={x.match.params.org} channel={y.match.params.channel} />)
                                } />
                            </ConnectedLayout>)
                        } />
                        <Route path='/*' component={NotFound} />
                    </Switch>
                </div>
            </ConnectedRouter>
            {debugEnabled ? <ConnectedDebugger /> : null}
        </div>
    </Provider>
};

export default App;