CREATE TABLE `ChatChannels` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(180) NOT NULL,
    `organizationId` int(11) NOT NULL,
    `discussionContextId` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT fk_chatChannel_organizationId
        FOREIGN KEY (`organizationId`)
        REFERENCES `Organizations` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_chatChannel_discussionContextId
        FOREIGN KEY (`discussionContextId`)
        REFERENCES `DiscussionContexts` (`id`)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
