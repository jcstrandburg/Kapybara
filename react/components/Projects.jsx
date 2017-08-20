import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

export default class Projects extends React.Component {
    state = {
        isNewModalOpen: false
    };

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
        this.closeNewModal();
    }

    closeNewModal = () => this.setState({ isNewModalOpen: false });

    openNewModal = () => this.setState({ isNewModalOpen: true });

    getOrganizationId = () => this.props.organizations[this.props.organizationToken] && this.props.organizations[this.props.organizationToken].id;

    getDisplayableProjects = () => {
        let organizationId = this.getOrganizationId();
        return Object.values(this.props.projects).filter(proj => proj.parentProjectId == this.props.projectId && proj.organizationId == organizationId);
    }

    render() {
        return (
            <div>
                Projects - <button onClick={this.openNewModal}>New</button><br />
                <ProjectList organizationToken={this.props.organizationToken} projects={this.getDisplayableProjects()} />
                <Modal isOpen={ this.state.isNewModalOpen } contentLabel="Create New Project">
                    <CreateProject createProject={this.createProject} cancel={this.closeNewModal} />
                </Modal>
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
};

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
                    <h1>Create New Project</h1>
                    Project Name: <input type="text" ref={(input) => this.input = input} /><br />
                    <input type="submit" value="Create" />
                    <input type="submit" value="Cancel" />
                </form>
            </div>
        );
    }
}

CreateProject.propTypes = {
    cancel: PropTypes.func.isRequired,
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
