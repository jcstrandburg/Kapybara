import React from 'react';
import { Link } from 'react-router-dom';

export default class Projects extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            match: props.match,
            projects: this.props.projects,
        };
        this.createProject = this.createProject.bind(this);
        this.getOrganizationId = this.getOrganizationId.bind(this);
    }

    componentWillMount() {
        this.props.onLoad(this.props.organizationToken);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            projects: nextProps.projects,
        });
    }

    createProject(projectName) {
        this.props.onCreateProject({ name: projectName, organizationId: this.getOrganizationId() });
    }

    getOrganizationId() {
        console.log(this);
        return this.props.organizations[this.props.organizationToken].id;
    }

    render() {
        return (
            <div>
                Projects<br />
                <ProjectList projects={this.state.projects} />
                <CreateProject createProject={this.createProject}/>
            </div>
        );
    }
}

class CreateProject extends React.Component {
    constructor(props) {
        super(props);

        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(event) {
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
                <Link to={'/projects/' + this.props.projectId}>
                    {this.props.projectName}
                </Link>
            </div>
        );
    }
}

class ProjectList extends React.Component {
    constructor(props) {
        super(props);
        this.renderProject = this.renderProject.bind(this);
    }

    renderProject(project) {
        return (
            <ProjectLink key={project.id} projectId={project.id} projectName={project.name} />
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
