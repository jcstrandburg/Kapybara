ALTER TABLE `Projects`
    ADD COLUMN `discussionContextId` INT (11) NULL;

DELIMITER $$
CREATE PROCEDURE backfillProjectDiscussionContextId()
BEGIN
    DECLARE projectID INTEGER DEFAULT -1;
    DECLARE finished INTEGER DEFAULT 0;

    DECLARE projectIds CURSOR FOR
        SELECT id FROM `Projects` WHERE `discussionContextId` IS NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;
    OPEN projectIds;

    updateProjects: LOOP
        FETCH projectIds INTO projectId;
        IF finished = 1 THEN
        LEAVE updateProjects;
        END IF;

        INSERT INTO `DiscussionContexts` VALUES ();
        UPDATE `Projects` SET `discussionContextId`=(SELECT LAST_INSERT_ID()) WHERE `id`=projectId;
    END LOOP updateProjects;

    CLOSE projectIds;
END$$
DROP PROCEDURE IF EXISTS backfillProjectDiscussionContextId
DELIMITER ;

CALL backfillProjectDiscussionContextId();
ALTER TABLE `Projects`
    MODIFY COLUMN `discussionContextId` INT (11) NOT NULL;

ALTER TABLE `Projects`
    ADD CONSTRAINT fk_projects_discussionContextId
    FOREIGN KEY (`discussionContextId`)
    REFERENCES `DiscussionContexts` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;