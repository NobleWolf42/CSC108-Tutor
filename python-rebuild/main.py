from rag import ragConstruction, initializeRAG
from flask import Flask, request, make_response
from gevent import pywsgi
import requests
import json
app = Flask(__name__)

initializeRAG()

f = open('setting.config', "r", encoding="utf-8")
file = f.read()
f.close()
fileSplit = file.split(' ')
port = fileSplit[0]
jId = fileSplit[1]
jCs = fileSplit[2]
key = fileSplit[3]
cert = fileSplit[4]

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        response = make_response()
        return response
    
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', '*')
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

@app.route('/code', methods=['POST'])
def code():
    # Get the 'userinput' header value from the request.
    usrInput = request.headers.get('userinput', '')
    
    # Get the request body as a string.
    usrCode = request.get_data(as_text=True)
    
    # Create the response with the correct content type.
    data = {'clientId': jId, 'clientSecret': jCs, 'script': usrCode, 'stdin': usrInput, 'language': 'cpp', 'versionIndex': '0'}
    response = make_response(requests.post('https://api.jdoodle.com/v1/execute', data=str(json.dumps(data)), headers={'Content-Type' : 'application/json'}).json())
    response.headers.add('Content-Type', 'application/json')
    
    return response

@app.route('/hello', methods=['GET'])
def hello():
    # Process the inputs.
    result = "Hello World!"
    
    # Create the response with the correct content type.
    response = make_response(result)
    response.headers.add('Content-Type', 'text/plain')
    
    return response

if __name__ == '__main__':
    #pywsgi.WSGIServer(('0.0.0.0', int(port)), app, keyfile=key, certfile=cert).serve_forever()
    app.run(debug=True)
