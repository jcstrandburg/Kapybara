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

var SProjects = connect(
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

var SDebugger = connect(
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
                    <Route path="/:org/chat" component={({ match }) =>
                        (<Layout organizationToken={match.params.org}>
                            <Chat organizationToken={match.params.org} />
                        </Layout>)
                    } />
                    <Route path="/:org/chat/:channel" component={({ match }) => 
                        (<Layout organizationToken={match.params.org}>
                            <Chat
                                organizationToken={match.params.org}
                                channelToken={match.params.channel} />
                        </Layout>)
                    } />
                    <Route exact path="/:org/projects" component={({ match }) => 
                        (<Layout organizationToken={match.params.org}>
                            <SProjects organizationToken={match.params.org} />
                        </Layout>)
                     } />
                    <Route exact path="/:org/projects/:projectId" component={({ match }) =>
                        (<Layout organizationToken={match.params.org}>
                            <SProjects
                                organizationToken={match.params.org}
                                projectId={match.params.projectId} />
                        </Layout>)
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