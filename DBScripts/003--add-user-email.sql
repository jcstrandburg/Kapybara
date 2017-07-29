USE kapybara;

ALTER TABLE `Users`
ADD COLUMN `email` VARCHAR(256) AFTER `username`;

UPDATE `Users` SET `email`= concat('dummy', `id`, '@example.com') WHERE `email` IS NULL;

ALTER TABLE `Users`
MODIFY COLUMN `email` VARCHAR(256) NOT NULL;
