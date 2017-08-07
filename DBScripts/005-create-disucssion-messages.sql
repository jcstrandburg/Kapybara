CREATE TABLE `DiscussionMessages` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `discussionContextId` int(11) NOT NULL,
    `userId` int(11) NOT NULL,
    `content` TEXT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT fk_discussionMessage_discussionContextId
        FOREIGN KEY (`discussionContextId`)
        REFERENCES `DiscussionContexts` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_discussionMessage_userId
        FOREIGN KEY (`userId`)
        REFERENCES `Users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `DiscussionMessages`
    ADD COLUMN `createdTime` DATETIME NOT NULL;
