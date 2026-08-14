ALTER TABLE `tracks` ADD `subGenre` varchar(120);--> statement-breakpoint
ALTER TABLE `tracks` ADD `trackKey` varchar(30);--> statement-breakpoint
ALTER TABLE `tracks` ADD `vibe` varchar(150);--> statement-breakpoint
ALTER TABLE `tracks` ADD `dspPlacement` varchar(150);--> statement-breakpoint
ALTER TABLE `tracks` ADD `lyrics` text;--> statement-breakpoint
ALTER TABLE `tracks` ADD `aiPackagingEnabled` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `tracks` ADD `virtualArtistsJson` text;