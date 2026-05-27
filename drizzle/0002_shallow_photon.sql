ALTER TABLE `posts` ADD `excerpt` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `cover_image` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `status` text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `meta_description` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `published_at` integer;--> statement-breakpoint
ALTER TABLE `posts` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `posts` DROP COLUMN `published`;