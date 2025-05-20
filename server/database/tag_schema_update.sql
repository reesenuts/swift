-- Create the group_tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS `group_tags` (
  `group_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`group_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `group_tags_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `group_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add on delete cascade to contact_tags if it doesn't already have it
ALTER TABLE `contact_tags` 
DROP FOREIGN KEY `contact_tags_ibfk_1`,
DROP FOREIGN KEY `contact_tags_ibfk_2`;

ALTER TABLE `contact_tags`
ADD CONSTRAINT `contact_tags_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `contact_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE; 