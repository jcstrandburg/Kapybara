USE `kapybara`;

ALTER TABLE `Projects`
    ADD COLUMN `parentProjectId` INT (11) NULL;

CREATE INDEX `ix_parentProjectId` on `Projects` (`parentProjectId`);

ALTER TABLE `Projects`
    ADD CONSTRAINT fk_projects_parentProjectId
    FOREIGN KEY (`parentProjectId`)
    REFERENCES `Projects` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;
