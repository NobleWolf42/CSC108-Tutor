from rag import ragConstruction, initializeRAG
from flask import Flask, request, make_response
import requests
app = Flask(__name__)

initializeRAG()

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        response = make_response()
        return response
    
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

@app.route('/questions', methods=['POST'])
def questions():
    # Get the 'usermsg' header value from the request.
    usrMsg = request.headers.get('usermsg', '')
    
    # Get the request body as a string.
    usrCode = request.get_data(as_text=True)
    
    # Log the received values.
    print("Question:", usrMsg, "\n")
    print("Code:", usrCode, "\n")
    
    # Process the inputs.
    result = ragConstruction(usrMsg, "")
    
    # Create the response with the correct content type.
    response = make_response(result)
    response.headers.add('Content-Type', 'text/plain')
    
    # Set CORS header to allow only the specified origin.
    #response.headers.add('Access-Control-Allow-Origin', '*')
    
    return response

if __name__ == '__main__':
    app.run(debug=True)
