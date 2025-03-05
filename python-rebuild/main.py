from flask import Flask, request, make_response

app = Flask(__name__)

def queryOllama(usrMsg, usrCode):
    # Replace this with the actual implementation.
    return f"Processed question: {usrMsg}\nProcessed code: {usrCode}"

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
    result = queryOllama(usrMsg, usrCode)
    
    # Create the response with the correct content type.
    response = make_response(result)
    response.headers['Content-Type'] = 'text/plain'
    
    # Set CORS header to allow only the specified origin.
    response.headers['Access-Control-Allow-Origin'] = 'https://bencarpenterit.com'
    
    return response

if __name__ == '__main__':
    app.run(debug=True)
