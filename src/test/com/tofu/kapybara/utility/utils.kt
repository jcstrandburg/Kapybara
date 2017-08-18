
import com.tofu.kapybara.data.IOrganizationRepository
import com.tofu.kapybara.data.IProjectRepository
import com.tofu.kapybara.data.IUserRepository
import com.tofu.kapybara.data.models.*
import java.util.*

fun createTestUser(userRepository: IUserRepository): User {
    val uniqueId = UUID.randomUUID().toString()
    return userRepository.createUser(UserCreate(
        name = uniqueId,
        password = "password",
        authToken = "",
        alias = "Test User $uniqueId",
        email = "$uniqueId@example.com"))
}

fun createTestOrganization(organizationRepository: IOrganizationRepository): Organization {
    val uniqueId = UUID.randomUUID().toString()
    return organizationRepository.createOrganization(OrganizationCreate(
        name="Test Organization $uniqueId",
        token=uniqueId))
}

fun createTestProject(projectRepository: IProjectRepository, organizationId: Int, parentProjectId: Int?): Project {
    return projectRepository.createProject(ProjectCreate(UUID.randomUUID().toString(), organizationId, parentProjectId))
}