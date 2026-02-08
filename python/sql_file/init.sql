DROP TABLE IF EXISTS attraction;

CREATE TABLE attraction (
    attraction_id int auto_increment,
    primary key(attraction_id),
    nom varchar(255) not null,
    description varchar(255) not null,
    difficulte int,
    visible bool default true
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    users_id int auto_increment,
    primary key(users_id),
    name varchar(255) not null,
    password varchar(255) not null
);


DROP TABLE IF EXISTS critique;

CREATE TABLE critique (
    critique_id INT AUTO_INCREMENT,
    PRIMARY KEY(critique_id),
    attraction_id INT NOT NULL,
    texte TEXT NOT NULL,
    note INT NOT NULL CHECK (note >= 1 AND note <= 5),
    prenom VARCHAR(100),
    nom VARCHAR(100),
    anonyme BOOL DEFAULT FALSE,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attraction_id) REFERENCES attraction(attraction_id) ON DELETE CASCADE
);