import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

import toDict from '../util/toDict.js';
import ActionButton from './common/ActionButton.jsx';

const defaultAuthor = {
    name: 'loading...',
    alias: 'loading...',
}

export default class Projects extends React.Component {
    state = {
        isNewModalOpen: false,
        authors: {},
    };

    componentWillMount() {
        let { comments, userRepository, lazyLoadUser, organizationToken, projectId } = this.props;

        this.setState({
                authors: this.getAuthors(comments, userRepository, lazyLoadUser),
            });

        this.props.onLoad(organizationToken);
        if (projectId) {
            this.props.getProjectData(projectId);
            this.props.getChildrenProjects(organizationToken, projectId);
        }
    }

    componentWillReceiveProps(nextProps) {
        let { comments, userRepository, lazyLoadUser, organizationToken, projectId } = nextProps;

        this.setState({
                authors: this.getAuthors(comments, userRepository, lazyLoadUser),
            });

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

    getAuthors = (comments, userRepository, lazyLoadUser) => {
        return toDict([...new Set(comments.map(it => it.userId))]
            .map(id => userRepository.getOrLazyLoad(id, lazyLoadUser) || defaultAuthor),
            it => it.id);
    }

    render() {
        return (
            <div>
                Projects - <ActionButton onClick={this.openNewModal} text="New" /><br />
                <ProjectList organizationToken={this.props.organizationToken} projects={this.getDisplayableProjects()} />
                {this.props.projectId && this.props.projects[this.props.projectId]
                    ? <ProjectDetails
                        authors={this.state.authors}
                        comments={this.props.comments}
                        project={this.props.projects[this.props.projectId]}
                        postComment={(content) => this.props.postComment(this.props.projectId, content)} />
                    : null}
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
    comments: PropTypes.arrayOf(PropTypes.object),
    userRepository: PropTypes.object,

    getProjectData: PropTypes.func.isRequired,
    getChildrenProjects: PropTypes.func.isRequired,
    onCreateProject: PropTypes.func.isRequired,
    postComment: PropTypes.func.isRequired,
    lazyLoadUser: PropTypes.func.isRequired,
};

Projects.defaultProps = {
    projectId: null,
};

class ProjectDetails extends React.Component {
    submitComment = (event) => {
        this.props.postComment(this.input.value);
        this.input.value = "";
    }

    renderComment = (comment) => {
        let author = this.props.authors[comment.userId] || defaultAuthor;
        return (<div key={comment.id}>
            Author: {author.alias || author.name}<br />
            When: {comment.createdTime}<br />
            Comment: {comment.content}<br />
        </div>)
    };

    render() {
        return (
            <div>
                <h2>Discussion</h2>
                {this.props.comments.map(this.renderComment)}

                <textarea ref={(input) => this.input = input} ></textarea>
                <button onClick={this.submitComment}>Submit</button>
            </div>
        );
    }
}

ProjectDetails.propTypes = {
    project: PropTypes.object.isRequired,
    comments: PropTypes.arrayOf(PropTypes.object).isRequired,
    authors: PropTypes.objectOf(PropTypes.object).isRequired,

    postComment: PropTypes.func.isRequired,
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
