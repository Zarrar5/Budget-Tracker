from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="budget"
)

mycursor = db.cursor()
mycursor.execute("""
    CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_name VARCHAR(255),
        cost DECIMAL(10, 2),
        date_purchased DATE,
        category VARCHAR(255)
    );
""")
db.commit()

@app.route("/home", methods=["GET"])
def home():

    mycursor = db.cursor()
    mycursor.execute("""SELECT * FROM items""")
    myresult = mycursor.fetchall()

    mycursor.execute("SELECT SUM(cost) FROM items")
    total_cost = mycursor.fetchone()[0] 

    mycursor.close()

    items = []
    for row in myresult:
        formatted_date = row[3].strftime('%b %d, %Y')
        items.append({
            'id': row[0],
            'item_name': row[1],
            'cost': row[2],
            'date_purchased': formatted_date,
            'category': row[4]
        })
    
    return jsonify({
        "items": items,
        "total_cost": total_cost
    })

@app.route("/add_item", methods=["POST"])
def add_item():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid input"}), 400

    try:
        item_name = data['item_name']
        cost = float(data['cost'])
        date_purchased = data['date_purchased']
        category = data['category']
        
    except KeyError as e:
        return jsonify({"error": f"Missing: {str(e)}"}), 400

    mycursor = db.cursor()

    mycursor.execute("""
        INSERT INTO items (item_name, cost, date_purchased, category)
        VALUES (%s, %s, %s, %s)
    """, (item_name, cost, date_purchased, category))

    db.commit()

    return jsonify(message="Item added")

@app.route("/update_item/<int:id>", methods=["PATCH"])
def update_item(id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid input"}), 400

    try:
        item_name = data.get('item_name')
        cost = data.get('cost')
        date_purchased = data.get('date_purchased')
        category = data.get('category')
    except KeyError as e:
        return jsonify({"error": f"Missing: {str(e)}"}), 400

    mycursor = db.cursor()

    fields = []
    values = []
    if item_name is not None:
        fields.append("item_name = %s")
        values.append(item_name)
    if cost is not None:
        fields.append("cost = %s")
        values.append(float(cost))
    if date_purchased is not None:
        fields.append("date_purchased = %s")
        values.append(date_purchased)
    if category is not None:
        fields.append("category = %s")
        values.append(category)

    if not fields:
        return jsonify({"error": "No fields to update"}), 400

    values.append(id)
    query = f"UPDATE items SET {', '.join(fields)} WHERE id = %s"

    mycursor.execute(query, tuple(values))
    db.commit()

    return jsonify(message="Item updated")

@app.route("/delete_item/<int:id>", methods=["DELETE"])
def delete_item(id):
    mycursor = db.cursor()

    mycursor.execute("DELETE FROM items WHERE id = %s", (id,))
    db.commit()

    return jsonify(message=f"Item {id} deleted")

if __name__ == "__main__":
    app.run(debug=True)
