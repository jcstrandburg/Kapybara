import React from 'react';
import { HashRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import { Provider, dispatch, connect } from 'react-redux';
import * as actions from './actions';
import store from './store';
import { fetchJson } from './appclient';

import Home from './components/Home.jsx';
import Projects from './components/Projects.jsx';
import NotFound from './components/NotFound.jsx'
import Chat from './components/Chat.jsx';
import Layout from './components/Layout.jsx';
import Debugger from './components/Debugger.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';

function mapStateToProps(state) {
    var props = {
        organizations: state.organizations,
        projects: state.projects
    };
    return props;
}

function mapDispatchToProps(dispatch) {
    return {
        onAddProject: (project) => {
            dispatch(actions.addProject(project))
        }
    };
}

var SHome = connect(
    state => ({}),
    dispatch => ({
        createOrganization: organization => dispatch(actions.addOrganization(organization)),
    })
);

var SProjects = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Projects);

var SDebugger = connect(
    (state) => ({
        state: state
    }),
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
                            onLoad: () => dispatch(actions.fetchCurrentUser()),
                            createOrganization: (org) => dispatch(actions.addOrganization(org))
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
                    <Route path="/:org/projects" component={({ match }) => 
                        (<Layout organizationToken={match.params.org}>
                            <SProjects organizationToken={match.params.org} />
                        </Layout>)
                     } />
                    <Route path="/:org/projects/:projectId" component={({ match }) =>
                        (<Layout route="roberto" organizationToken={match.params.org}>
                            <SProjects
                                organization={match.params.org}
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