import request.request as req

def add_critique(data):
    """Ajouter une critique pour une attraction"""
    if not "attraction_id" in data or not data["attraction_id"]:
        return False
    
    if not "texte" in data or data["texte"] == "":
        return False
    
    if not "note" in data or data["note"] is None or data["note"] < 1 or data["note"] > 5:
        return False
    
    # Gérer l'anonymat
    anonyme = data.get("anonyme", False)
    prenom = "" if anonyme else data.get("prenom", "")
    nom = "" if anonyme else data.get("nom", "")
    
    requete = """
        INSERT INTO critique (attraction_id, texte, note, prenom, nom, anonyme) 
        VALUES (?, ?, ?, ?, ?, ?)
    """
    
    critique_id = req.insert_in_db(
        requete, 
        (data["attraction_id"], data["texte"], data["note"], prenom, nom, anonyme)
    )
    
    return critique_id

def get_critiques_by_attraction(attraction_id):
    """Récupérer toutes les critiques d'une attraction"""
    if not attraction_id:
        return []
    
    requete = """
        SELECT critique_id, attraction_id, texte, note, prenom, nom, anonyme, date_creation
        FROM critique 
        WHERE attraction_id = ?
        ORDER BY date_creation DESC
    """
    
    critiques = req.select_from_db(requete, (attraction_id,))
    return critiques

def get_all_critiques():
    """Récupérer toutes les critiques (pour admin)"""
    requete = """
        SELECT c.critique_id, c.attraction_id, a.nom as attraction_nom, 
               c.texte, c.note, c.prenom, c.nom, c.anonyme, c.date_creation
        FROM critique c
        JOIN attraction a ON c.attraction_id = a.attraction_id
        ORDER BY c.date_creation DESC
    """
    
    critiques = req.select_from_db(requete)
    return critiques

def get_critique_stats(attraction_id):
    """Obtenir les statistiques des critiques pour une attraction"""
    if not attraction_id:
        return None
    
    requete = """
        SELECT 
            COUNT(*) as nombre_critiques,
            AVG(note) as note_moyenne,
            MIN(note) as note_min,
            MAX(note) as note_max
        FROM critique 
        WHERE attraction_id = ?
    """
    
    stats = req.select_from_db(requete, (attraction_id,))
    
    if len(stats) > 0:
        return stats[0]
    return None

def delete_critique(critique_id):
    """Supprimer une critique (admin uniquement)"""
    if not critique_id:
        return False
    
    req.delete_from_db("DELETE FROM critique WHERE critique_id = ?", (critique_id,))
    return True