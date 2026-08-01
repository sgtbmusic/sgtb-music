CREATE TABLE `contactMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`projectType` varchar(120),
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`role` varchar(200),
	`handle` varchar(120),
	`imageUrl` text,
	`imageKey` varchar(512),
	`credentials` text,
	`bio` text,
	`isPlaceholder` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`artist` varchar(200) NOT NULL DEFAULT 'SGTB Music',
	`genre` varchar(120),
	`bpm` int,
	`audioUrl` text NOT NULL,
	`audioKey` varchar(512) NOT NULL,
	`mimeType` varchar(128),
	`coverUrl` text,
	`coverKey` varchar(512),
	`coverVariant` int NOT NULL DEFAULT 0,
	`durationSeconds` int,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracks_id` PRIMARY KEY(`id`)
);
