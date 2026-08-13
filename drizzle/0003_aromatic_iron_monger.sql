ALTER TABLE `tracks` ADD `status` enum('pending','approved','rejected') DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE `tracks` ADD `playsCount` int DEFAULT 1420 NOT NULL;--> statement-breakpoint
ALTER TABLE `tracks` ADD `upvotesCount` int DEFAULT 320 NOT NULL;--> statement-breakpoint
ALTER TABLE `tracks` ADD `hitPotential` int DEFAULT 94 NOT NULL;--> statement-breakpoint
ALTER TABLE `tracks` ADD `syncReady` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `tracks` ADD `uploaderId` int;