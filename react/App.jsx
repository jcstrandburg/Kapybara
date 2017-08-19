import React from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import { Provider, dispatch, connect } from 'react-redux';
import { createStore, applyMiddleware  } from 'redux';

import * as projects from './ducks/project';
import * as organizations from './ducks/organization';
import applicationReducer, { getCurrentUser } from './ducks/root';
import middlewares from './middlewares.js';

import Home from './components/Home.jsx';
import Projects from './components/Projects.jsx';
import NotFound from './components/NotFound.jsx'
import Chat from './components/Chat.jsx';
import Layout from './components/Layout.jsx';
import Debugger from './components/Debugger.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';

let store = createStore(
    applicationReducer,
    applyMiddleware(
        middlewares.actionLogMiddleware,
        middlewares.asyncDispatchMiddleware));

const SProjects = connect(
    (state) => ({
        organizations: state.organizations,
        projects: state.projects
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
            dispatch(projects.getProjectComments(projectId));
        },
        getChildrenProjects: (organizationToken, parentProjectId) => {
            dispatch(projects.getOrganizationProjects(organizationToken, parentProjectId));
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
        let { actionHistory, ...coreState } = state;

        return {
            state: coreState,
            actionHistory
        };
    },
)(Debugger);

const debugEnabled = true;

const App = () => {
    return <Provider store={store}>
        <div className="app-container">
            <BrowserRouter basename="/app">
                <div className="app-container">
                    <Switch>
                        <Route exact path="/" component={connect(
                            (state)  => ({
                                user: state.user,
                                organizations: state.organizations,
                            }),
                            (dispatch) => ({
                                onLoad: () => dispatch(getCurrentUser()),
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
            </BrowserRouter>
            {debugEnabled ? <SDebugger /> : null}
        </div>
    </Provider>
};

export default App;