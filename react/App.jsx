import React from 'react';
import { HashRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import { Provider, dispatch, connect } from 'react-redux';
import store from './store';

import * as projects from './ducks/project';
import * as organizations from './ducks/organization';
import { getCurrentUser } from './ducks/root';

import Home from './components/Home.jsx';
import Projects from './components/Projects.jsx';
import NotFound from './components/NotFound.jsx'
import Chat from './components/Chat.jsx';
import Layout from './components/Layout.jsx';
import Debugger from './components/Debugger.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';

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

class Kapybara extends React.Component {
    render() {return (
        <HashRouter>
            <div>
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
                    <Route path="/:org" component={(x) =>
                        (<SLayout organizationToken={x.match.params.org}>
                            <Route path={x.match.url+'/projects'} component={(y) =>
                                (<SProjects organizationToken={x.match.params.org}>
                                    <span>Projects go here</span>
                                </SProjects>)
                            } />
                            <Route path={x.match.url+'/chat/:channel'} component={(y) =>
                                (<SChat organizationToken={x.match.params.org} channel={y.match.params.channel}>
                                    <span>Chat goes here</span>
                                </SChat>)
                            } />
                        </SLayout>)
                    } />
                    <Route path="/settings" component={SettingsPanel} />
                    <Route path='/*' component={NotFound} />
                </Switch>
                <SDebugger />
            </div>
        </HashRouter>
    );}
}

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Kapybara />
            </Provider>
        );
    }
}

export default App;