CREATE DATABASE IF NOT EXISTS kapybara
    DEFAULT CHARACTER SET=utf8mb4
    DEFAULT COLLATE=utf8mb4_unicode_ci;

USE kapybara;

CREATE TABLE `Users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(60) NOT NULL,
    `password` varchar(128) NOT NULL,
    `alias` varchar(60) NOT NULL,
    `authToken` varchar(60),
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Organizations` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(120) NOT NULL,
    `token` varchar(40) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `OrganizationRelationships` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `userId` int(11) NOT NULL,
    `organizationId` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `userId_organizationId` (`userId`, `organizationId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;