CREATE TABLE `person` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `category` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `item` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `value` BIGINT NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `item_category_id_foreign`
        FOREIGN KEY (`category_id`)
        REFERENCES `category`(`id`)
);

CREATE TABLE `wanted_item` (
    `item_id` BIGINT UNSIGNED NOT NULL,
    `priority` BIGINT NOT NULL,
    PRIMARY KEY (`item_id`),
    CONSTRAINT `wanted_item_item_id_foreign`
        FOREIGN KEY (`item_id`)
        REFERENCES `item`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE `owned_item` (
    `item_id` BIGINT UNSIGNED NOT NULL,
    `condition` ENUM(
        'New',
        'Excellent',
        'Good',
        'Fair',
        'Poor',
        'Unusable'
    ) NOT NULL,
    `date_obtained` DATE NOT NULL,
    PRIMARY KEY (`item_id`),
    CONSTRAINT `owned_item_item_id_foreign`
        FOREIGN KEY (`item_id`)
        REFERENCES `item`(`id`)
        ON DELETE CASCADE
);

CREATE TABLE `person_item` (
    `person_id` BIGINT UNSIGNED NOT NULL,
    `item_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`person_id`, `item_id`),
    CONSTRAINT `person_item_person_id_foreign`
        FOREIGN KEY (`person_id`)
        REFERENCES `person`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `person_item_item_id_foreign`
        FOREIGN KEY (`item_id`)
        REFERENCES `item`(`id`)
        ON DELETE CASCADE
);
