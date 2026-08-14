CREATE TABLE `cadence_tournaments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seasonName` varchar(128) NOT NULL,
	`winnerName` varchar(128) NOT NULL,
	`winningPoints` int NOT NULL,
	`prizeDescription` text NOT NULL,
	`endedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cadence_tournaments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `pushEnabled` int DEFAULT 0 NOT NULL;