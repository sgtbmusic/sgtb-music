CREATE TABLE `executiveCatalog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`artist` varchar(200) NOT NULL,
	`category` enum('Suno Voice Persona','Hybrid Stem') NOT NULL,
	`audioUrl` text NOT NULL,
	`stemPackageUrl` text,
	`bpm` int NOT NULL DEFAULT 120,
	`genre` varchar(100) NOT NULL DEFAULT 'Pop / Cinematic',
	`hitPotential` int NOT NULL DEFAULT 95,
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `executiveCatalog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `executiveMeetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`executiveName` varchar(200) NOT NULL,
	`organization` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`requestedDate` varchar(100) NOT NULL,
	`notes` text,
	`status` enum('pending','confirmed','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `executiveMeetings_id` PRIMARY KEY(`id`)
);
