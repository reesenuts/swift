-- Script to update templates with NULL user_id
-- Replace 1 with the desired user ID (typically admin user)
UPDATE templates SET user_id = 1 WHERE user_id IS NULL; 