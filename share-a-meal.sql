
-- database share a meal

-- user table
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `emailAdress` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) DEFAULT '-',
  `roles` set('admin','editor','guest') NOT NULL DEFAULT 'editor,guest',
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_87877a938268391a71723b303c` (`emailAdress`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- meal table

DROP TABLE IF EXISTS `meal`;

CREATE TABLE `meal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isActive` tinyint NOT NULL DEFAULT '0',
  `isVega` tinyint NOT NULL DEFAULT '0',
  `isVegan` tinyint NOT NULL DEFAULT '0',
  `isToTakeHome` tinyint NOT NULL DEFAULT '1',
  `dateTime` datetime NOT NULL,
  `maxAmountOfParticipants` int NOT NULL DEFAULT '6',
  `price` decimal(5,2) NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `cookId` int DEFAULT NULL,
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(200) NOT NULL,
  `description` varchar(400) NOT NULL,
  `allergenes` set('gluten','lactose','noten') NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `FK_e325266e1b4188f981a00677580` (`cookId`),
  CONSTRAINT `FK_e325266e1b4188f981a00677580` FOREIGN KEY (`cookId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- meal participants table

DROP TABLE IF EXISTS `meal_participants_user`;

CREATE TABLE `meal_participants_user` (
  `mealId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`mealId`,`userId`),
  KEY `IDX_726a90e82859401ab88867dec7` (`mealId`),
  KEY `IDX_6d0a7d816bf85b634a3c6a83ac` (`userId`),
  CONSTRAINT `FK_6d0a7d816bf85b634a3c6a83aca` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_726a90e82859401ab88867dec7f` FOREIGN KEY (`mealId`) REFERENCES `meal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;