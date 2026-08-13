CREATE TABLE `sunoEpisodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`host` varchar(200) NOT NULL DEFAULT 'Rosie Nguyen & Guests',
	`description` text,
	`audioUrl` text NOT NULL,
	`audioKey` varchar(512) NOT NULL,
	`durationSeconds` int,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sunoEpisodes_id` PRIMARY KEY(`id`)
);
