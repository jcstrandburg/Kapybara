package com.tofu.kapybara.data

import com.tofu.kapybara.data.models.DiscussionMessage
import com.tofu.kapybara.data.models.DiscussionMessageCreate
import com.tofu.kapybara.data.models.Project
import com.tofu.kapybara.data.models.ProjectCreate

interface IProjectRepository {
    fun getProject(projectId: Int): Project?
    fun createProject(project: ProjectCreate): Project
    fun getProjectsForOrganization(organizationId: Int): List<Project>
    fun addDiscussionMessage(projectId: Int, message: DiscussionMessageCreate): DiscussionMessage
    fun getDiscussionMessages(projectId: Int): List<DiscussionMessage>
}