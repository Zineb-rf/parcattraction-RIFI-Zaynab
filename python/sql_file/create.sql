INSERT INTO attraction (nom, description, difficulte, visible) VALUES ('Silver Star', 'Montagne russe', 3, 1);
INSERT INTO attraction (nom, description, difficulte, visible) VALUES ('Montagne 8', 'Montagne russe', 4, 1);
INSERT INTO attraction (nom, description, difficulte, visible) VALUES ('La Tour de la Terreur', 'Chute libre vertigineuse', 5, 1);
INSERT INTO attraction (nom, description, difficulte, visible) VALUES ('Carrousel Magique', 'Manège pour enfants', 1, 1);
INSERT INTO attraction (nom, description, difficulte, visible) VALUES ('Grand Huit Extrême', 'En maintenance', 5, 0);


INSERT INTO users (name, password) VALUES ('admin', 'admin123');
INSERT INTO users (name, password) VALUES ('toto', 'toto');



-- Insertion de critiques de test
INSERT INTO critique (attraction_id, texte, note, prenom, nom, anonyme) 
VALUES (1, 'Attraction incroyable ! Sensations fortes garanties.', 5, 'Jean', 'Dupont', 0);

INSERT INTO critique (attraction_id, texte, note, prenom, nom, anonyme) 
VALUES (1, 'Un peu trop rapide pour moi mais très bien conçu.', 4, '', '', 1);

INSERT INTO critique (attraction_id, texte, note, prenom, nom, anonyme) 
VALUES (2, 'Parfait pour toute la famille, mes enfants ont adoré !', 5, 'Marie', 'Martin', 0);

INSERT INTO critique (attraction_id, texte, note, prenom, nom, anonyme) 
VALUES (2, 'Bien mais un peu d\'attente.', 3, '', '', 1);