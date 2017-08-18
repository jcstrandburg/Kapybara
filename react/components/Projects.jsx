import React from 'react';
import { Link } from 'react-router-dom';

export default class Projects extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            match: props.match,
            projects: this.props.projects,
        };
    }

    componentWillMount() {
        this.props.onLoad(this.props.organizationToken);
        if (this.props.projectId) {
            this.props.getProjectData(this.props.projectId);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.projectId && nextProps.projectId != this.props.projectId) {
            this.props.getProjectData(nextProps.projectId);
        }

        this.setState({
            projects: nextProps.projects,
        });
    }

    createProject = (projectName) => {
        this.props.onCreateProject({ name: projectName, organizationId: this.getOrganizationId() });
    }

    getOrganizationId = () => {
        return this.props.organizations[this.props.organizationToken].id;
    }

    render() {
        return (
            <div>
                Projects<br />
                <ProjectList organizationToken={this.props.organizationToken} projects={this.props.projects} />
                <CreateProject createProject={this.createProject}/>
            </div>
        );
    }
}

class CreateProject extends React.Component {
    constructor(props) {
        super(props);
    }

    submitForm = (event) => {
        event.preventDefault();
        this.props.createProject(this.input.value);
        this.input.value = null;
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submitForm}>
                    <input type="text" ref={(input) => this.input = input}></input>
                    <input type="submit" value="Create"></input>
                </form>
            </div>
        );
    }
}

class ProjectLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Link to={'/' + this.props.organizationToken + '/projects/' + this.props.projectId}>
                    {this.props.projectName}
                </Link>
            </div>
        );
    }
}

class ProjectList extends React.Component {
    constructor(props) {
        super(props);
    }

    renderProject = (project) => {
        return (
            <ProjectLink key={project.id} organizationToken={this.props.organizationToken} projectId={project.id} projectName={project.name} />
        );
    }

    render() {
        return (
            <div>
                {Object.values(this.props.projects).map(this.renderProject)}
            </div>
        );
    }
}
