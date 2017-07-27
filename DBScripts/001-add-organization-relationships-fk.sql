USE kapybara;

ALTER TABLE `OrganizationRelationships`
  ADD CONSTRAINT fk_userId
  FOREIGN KEY (`userId`)
  REFERENCES `Users` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `OrganizationRelationships`
  ADD CONSTRAINT fk_organizationId
  FOREIGN KEY (`organizationId`)
  REFERENCES `Organizations` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
