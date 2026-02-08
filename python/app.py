from flask import Flask, jsonify, request
from flask_cors import CORS

import request.request as req
import controller.auth.auth as user
import controller.attraction as attraction
import controller.critique as critique

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, Docker!'

# ==================== ATTRACTIONS ====================

@app.post('/attraction')
def addAttraction():
    """Ajouter ou modifier une attraction (admin uniquement)"""
    # Vérification du token
    checkToken = user.check_token(request)
    if checkToken != True:
        return checkToken

    json = request.get_json()
    retour = attraction.add_attraction(json)
    if retour:
        return jsonify({"message": "Élément ajouté.", "result": retour}), 200
    return jsonify({"message": "Erreur lors de l'ajout.", "result": retour}), 500

@app.get('/attraction')
def getAllAttraction():
    """
    Récupérer toutes les attractions
    Paramètre optionnel: admin=true pour voir toutes les attractions (nécessite authentification)
    Sans paramètre: ne renvoie que les attractions visibles
    """
    # Vérifier si c'est une requête admin
    is_admin_request = request.args.get('admin', 'false').lower() == 'true'
    
    if is_admin_request:
        # Vérifier le token pour les admins
        checkToken = user.check_token(request)
        if checkToken != True:
            return checkToken
        result = attraction.get_all_attraction(visible_only=False)
    else:
        # Pour les visiteurs, uniquement les attractions visibles
        result = attraction.get_all_attraction(visible_only=True)
    
    return result, 200

@app.get('/attraction/<int:index>')
def getAttraction(index):
    """
    Récupérer une attraction par son ID
    Paramètre optionnel: admin=true pour voir même si non visible
    """
    is_admin_request = request.args.get('admin', 'false').lower() == 'true'
    
    if is_admin_request:
        checkToken = user.check_token(request)
        if checkToken != True:
            return checkToken
        result = attraction.get_attraction(index, visible_only=False)
    else:
        result = attraction.get_attraction(index, visible_only=True)
    
    return result, 200

@app.delete('/attraction/<int:index>')
def deleteAttraction(index):
    """Supprimer une attraction (admin uniquement)"""
    # Vérification du token
    checkToken = user.check_token(request)
    if checkToken != True:
        return checkToken

    if attraction.delete_attraction(index):
        return jsonify({"message": "Élément supprimé."}), 200
    return jsonify({"message": "Erreur lors de la suppression."}), 500

@app.patch('/attraction/<int:index>/visibility')
def toggleAttractionVisibility(index):
    """Basculer la visibilité d'une attraction (admin uniquement)"""
    # Vérification du token
    checkToken = user.check_token(request)
    if checkToken != True:
        return checkToken
    
    if attraction.toggle_visibility(index):
        return jsonify({"message": "Visibilité modifiée."}), 200
    return jsonify({"message": "Erreur lors de la modification."}), 500

# ==================== CRITIQUES ====================

@app.post('/attraction/<int:attraction_id>/critique')
def addCritique(attraction_id):
    """Ajouter une critique pour une attraction (accessible à tous)"""
    json = request.get_json()
    json['attraction_id'] = attraction_id
    
    retour = critique.add_critique(json)
    if retour:
        return jsonify({"message": "Critique ajoutée avec succès.", "result": retour}), 201
    return jsonify({"message": "Erreur lors de l'ajout de la critique."}), 400

@app.get('/attraction/<int:attraction_id>/critique')
def getCritiquesByAttraction(attraction_id):
    """Récupérer toutes les critiques d'une attraction (accessible à tous)"""
    critiques_list = critique.get_critiques_by_attraction(attraction_id)
    return jsonify(critiques_list), 200

@app.get('/attraction/<int:attraction_id>/critique/stats')
def getCritiqueStats(attraction_id):
    """Obtenir les statistiques des critiques pour une attraction"""
    stats = critique.get_critique_stats(attraction_id)
    if stats:
        return jsonify(stats), 200
    return jsonify({"message": "Aucune statistique disponible."}), 404

@app.get('/critique')
def getAllCritiques():
    """Récupérer toutes les critiques (admin uniquement)"""
    # Vérification du token
    checkToken = user.check_token(request)
    if checkToken != True:
        return checkToken
    
    critiques_list = critique.get_all_critiques()
    return jsonify(critiques_list), 200

@app.delete('/critique/<int:critique_id>')
def deleteCritique(critique_id):
    """Supprimer une critique (admin uniquement)"""
    # Vérification du token
    checkToken = user.check_token(request)
    if checkToken != True:
        return checkToken
    
    if critique.delete_critique(critique_id):
        return jsonify({"message": "Critique supprimée."}), 200
    return jsonify({"message": "Erreur lors de la suppression."}), 500

# ==================== AUTHENTIFICATION ====================

@app.post('/login')
def login():
    """Connexion utilisateur"""
    json = request.get_json()

    if not 'name' in json or not 'password' in json:
        result = jsonify({'messages': ["Nom ou/et mot de passe incorrect"]})
        return result, 400
    
    cur, conn = req.get_db_connection()
    requete = f"SELECT * FROM users WHERE name = '{json['name']}' AND password = '{json['password']}';"
    cur.execute(requete)
    records = cur.fetchall()
    conn.close()

    if len(records) == 0:
        return jsonify({'messages': ["Identifiants incorrects"]}), 401

    result = jsonify({"token": user.encode_auth_token(list(records[0])[0]), "name": json['name']})
    return result, 200