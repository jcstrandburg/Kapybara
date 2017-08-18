import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Projects extends React.Component {
    componentWillMount() {
        let { organizationToken, projectId } = this.props;

        this.props.onLoad(organizationToken);
        if (projectId) {
            this.props.getProjectData(projectId);
            this.props.getChildrenProjects(organizationToken, projectId);
        }
    }

    componentWillReceiveProps(nextProps) {
        let { organizationToken, projectId } = nextProps;

        if (projectId && projectId != this.props.projectId) {
            this.props.getProjectData(projectId);
            this.props.getChildrenProjects(organizationId, projectId);
        }
    }

    createProject = (projectName) => {
        this.props.onCreateProject({ name: projectName, organizationId: this.getOrganizationId(), parentProjectId: this.props.projectId });
    }

    getOrganizationId = () => {
        return this.props.organizations[this.props.organizationToken].id;
    }

    render() {
        return (
            <div>
                Projects<br />
                <ProjectList organizationToken={this.props.organizationToken} projects={Object.values(this.props.projects).filter(proj => proj.parentProjectId == this.props.projectId)} />
                <CreateProject createProject={this.createProject}/>
            </div>
        );
    }
}

Projects.propTypes = {
    organizationToken: PropTypes.string.isRequired,
    organizations: PropTypes.objectOf(PropTypes.object).isRequired,
    projectId: PropTypes.string,

    getProjectData: PropTypes.func.isRequired,
    getChildrenProjects: PropTypes.func.isRequired,
    onCreateProject: PropTypes.func.isRequired,
}

Projects.defaultProps = {
    projectId: null,
};

class CreateProject extends React.Component {
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

CreateProject.propTypes = {
    createProject: PropTypes.func.isRequired,
};

class ProjectLink extends React.Component {
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

ProjectLink.propTypes = {
    organizationToken: PropTypes.string.isRequired,
};

class ProjectList extends React.Component {
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

ProjectList.propTypes = {
    organizationToken: PropTypes.string.isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
};
