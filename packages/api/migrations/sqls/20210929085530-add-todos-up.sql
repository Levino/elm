CREATE TABLE todos
(
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    title VARCHAR (255) NOT NULL,
    userId VARCHAR (255) NOT NULL,
    description TEXT
) ENGINE=InnoDB;

