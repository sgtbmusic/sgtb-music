CREATE TABLE `user_rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`points` int NOT NULL DEFAULT 150,
	`tracks_listened` int NOT NULL DEFAULT 3,
	`episodes_listened` int NOT NULL DEFAULT 1,
	`tracks_shared` int NOT NULL DEFAULT 0,
	`drafts_rated` int NOT NULL DEFAULT 2,
	`tier` varchar(32) NOT NULL DEFAULT 'Listener',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_rewards_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_rewards_user_id_unique` UNIQUE(`user_id`)
);
