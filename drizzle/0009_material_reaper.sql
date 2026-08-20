ALTER TABLE `users` ADD `username` varchar(80);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `websiteUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `users` ADD `socialLinksJson` text;--> statement-breakpoint
ALTER TABLE `users` ADD `emailUpdatesEnabled` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);