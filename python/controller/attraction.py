import request.request as req

def add_attraction(data):
    print(data, flush=True)
    if not "nom" in data or data["nom"] == "":
        return False
    
    if not "description" in data or data["description"] == "":
        return False

    if not "difficulte" in data or data["difficulte"] is None:
        return False

    if not "visible" in data:
        data["visible"] = True

    if "attraction_id" in data and data["attraction_id"]:
        requete = f"UPDATE attraction SET nom='{data['nom']}', description='{data['description']}', difficulte={data['difficulte']}, visible={data['visible']} WHERE attraction_id = {data['attraction_id']}"
        req.insert_in_db(requete)
        id = data['attraction_id']
    else:
        requete = "INSERT INTO attraction (nom, description, difficulte, visible) VALUES (?, ?, ?, ?);"
        id = req.insert_in_db(requete, (data["nom"], data["description"], data["difficulte"], data["visible"]))

    return id

def get_all_attraction(visible_only=True):
    """
    Récupérer toutes les attractions
    visible_only: Si True, ne renvoie que les attractions visibles (pour les visiteurs)
                  Si False, renvoie toutes les attractions (pour les admins)
    """
    if visible_only:
        json = req.select_from_db("SELECT * FROM attraction WHERE visible = 1")
    else:
        json = req.select_from_db("SELECT * FROM attraction")
    
    return json

def get_attraction(id, visible_only=True):
    """
    Récupérer une attraction par son ID
    visible_only: Si True, vérifie que l'attraction est visible
    """
    if not id:
        return False

    if visible_only:
        json = req.select_from_db(
            "SELECT * FROM attraction WHERE attraction_id = ? AND visible = 1", 
            (id,)
        )
    else:
        json = req.select_from_db(
            "SELECT * FROM attraction WHERE attraction_id = ?", 
            (id,)
        )

    if len(json) > 0:
        return json[0]
    else:
        return []

def delete_attraction(id):
    if not id:
        return False

    req.delete_from_db("DELETE FROM attraction WHERE attraction_id = ?", (id,))

    return True

def toggle_visibility(attraction_id):
    """Basculer la visibilité d'une attraction"""
    if not attraction_id:
        return False
    
    # Récupérer l'état actuel
    attraction = get_attraction(attraction_id, visible_only=False)
    if not attraction:
        return False
    
    # Inverser la visibilité
    nouvelle_visibilite = not attraction['visible']
    
    requete = "UPDATE attraction SET visible = ? WHERE attraction_id = ?"
    req.update_from_db(requete, (nouvelle_visibilite, attraction_id))
    
    return True