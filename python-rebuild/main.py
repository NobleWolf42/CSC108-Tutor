from rag import ragConstruction, initializeRAG
from flask import Flask, jsonify, request

initializeRAG()

app = Flask(__name__)

# Sample data (in a real application, this would likely come from a database)
items = [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"}
]

# Route to get all items
@app.route('/items', methods=['GET'])
def get_items():
    return jsonify(items)

# Route to get a specific item by ID
@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = next((item for item in items if item['id'] == item_id), None)
    if item:
        return jsonify(item)
    return jsonify({"message": "Item not found"}), 404

# Route to create a new item
@app.route('/items', methods=['POST'])
def create_item():
    new_item = request.get_json()
    new_item['id'] = len(items) + 1
    items.append(new_item)
    return jsonify(new_item), 201

# Route to update an existing item
@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    updated_item = request.get_json()
    for index, item in enumerate(items):
        if item['id'] == item_id:
            updated_item['id'] = item_id
            items[index] = updated_item
            return jsonify(updated_item)
    return jsonify({"message": "Item not found"}), 404

# Route to delete an item
@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    for index, item in enumerate(items):
        if item['id'] == item_id:
            del items[index]
            return jsonify({"message": "Item deleted"})
    return jsonify({"message": "Item not found"}), 404

if __name__ == '__main__':
    from waitress import serve
    #serve(app, host="0.0.0.0", port=3006)
    app.run(debug=True)