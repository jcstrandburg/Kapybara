USE kapybara;

CREATE TABLE `Projects` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(180) NOT NULL,
    `organizationId` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT fk_projects_organizationId
        FOREIGN KEY (`organizationId`)
        REFERENCES `Organizations` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;