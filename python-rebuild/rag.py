# Import required libraries
from datetime import datetime
from langchain_ollama import OllamaEmbeddings, ChatOllama
import chromadb
import os

# Declare global vars
llmmodel = "llama3.2"
url = "http://localhost:11434"

#Borrowed this from a tutorial
class ChromaDBEmbeddingFunction:
    """
    Custom embedding function for ChromaDB using embeddings from Ollama.
    """
    def __init__(self, langchain_embeddings):
        self.langchain_embeddings = langchain_embeddings

    def __call__(self, input):
        # Ensure the input is in a list format for processing
        if isinstance(input, str):
            input = [input]

        testdata = self.langchain_embeddings.embed_documents(input)
        return testdata


# Initialize ChromaDB
chromaClient = chromadb.PersistentClient(path=os.path.join(os.getcwd(), "chroma_db")) # This remembers data in-between runs

# Initialize the embedding function with Ollama embeddings
embedding = ChromaDBEmbeddingFunction(
    OllamaEmbeddings(model=llmmodel, base_url=url)
)

# Define a collection for the RAG workflow
collection1_2 = chromaClient.get_or_create_collection(
    name="zybooks_cpp_chapters_1_2",
    metadata={"description": "A collection for RAG with Ollama - Chapters 1 and 2 of Zybooks C++"},
    embedding_function=embedding  # Use the custom embedding function
)

collection3 = chromaClient.get_or_create_collection(
    name="zybooks_cpp_chapters_3",
    metadata={"description": "A collection for RAG with Ollama - Chapter 3 of Zybooks C++"},
    embedding_function=embedding  # Use the custom embedding function
)

collection4 = chromaClient.get_or_create_collection(
    name="zybooks_cpp_chapters_4",
    metadata={"description": "A collection for RAG with Ollama - Chapter 4 of Zybooks C++"},
    embedding_function=embedding  # Use the custom embedding function
)

collection5 = chromaClient.get_or_create_collection(
    name="zybooks_cpp_chapters_5",
    metadata={"description": "A collection for RAG with Ollama - Chapter 5 of Zybooks C++"},
    embedding_function=embedding  # Use the custom embedding function
)

collection6 = chromaClient.get_or_create_collection(
    name="zybooks_cpp_chapters_6",
    metadata={"description": "A collection for RAG with Ollama - Chapter 6 of Zybooks C++"},
    embedding_function=embedding  # Use the custom embedding function
)
    
# Function to add documents to the ChromaDB collection
def addDocumentsToCollection1_2(documents, ids):
    collection1_2.add(
        documents=documents,
        ids=ids
    )

# Function to add documents to the ChromaDB collection
def addDocumentsToCollection3(documents, ids):
    collection3.add(
        documents=documents,
        ids=ids
    )

# Function to add documents to the ChromaDB collection
def addDocumentsToCollection4(documents, ids):
    collection4.add(
        documents=documents,
        ids=ids
    )

# Function to add documents to the ChromaDB collection
def addDocumentsToCollection5(documents, ids):
    collection5.add(
        documents=documents,
        ids=ids
    )

# Function to add documents to the ChromaDB collection
def addDocumentsToCollection6(documents, ids):
    collection6.add(
        documents=documents,
        ids=ids
    )

def initializeCH(ch):
    #Add documents to the collection
    documents = []
    docIds = []
    
    if (ch == 1_2):
        folderPath = os.path.join(os.path.dirname(__file__), "data", "CH1&2")
    elif (ch == 3):
        folderPath = os.path.join(os.path.dirname(__file__), "data", "CH3")
    elif (ch == 4):
        folderPath = os.path.join(os.path.dirname(__file__), "data", "CH4")
    elif (ch == 5):
        folderPath = os.path.join(os.path.dirname(__file__), "data", "CH5")
    elif (ch == 6):
        folderPath = os.path.join(os.path.dirname(__file__), "data", "CH6")
    
    for filename in os.listdir(folderPath):
        filePath = os.path.join(folderPath, filename)
        if os.path.isfile(filePath):
            #Process each file
            docIds.append(filename.replace(".txt", ""))
            try:
                f = open(filePath, "r", encoding="utf-8")
                documents.append(f.read())
                f.close()
            except Exception as e:
                print(e)
    
    #since its persistent this could be called only when needed to update the info
    if (ch == 1_2):
        addDocumentsToCollection1_2(documents, docIds)
    elif (ch == 3):
        addDocumentsToCollection3(documents, docIds)
    elif (ch == 4):
        addDocumentsToCollection4(documents, docIds)
    elif (ch == 5):
        addDocumentsToCollection5(documents, docIds)
    elif (ch == 6):
        addDocumentsToCollection6(documents, docIds)

# Initialise the RAG backend
def initializeRAG():
    initializeCH(1_2)
    initializeCH(3)
    initializeCH(4)
    initializeCH(5)
    initializeCH(6)
    return

# Function to query the ChromaDB collection
def queryChromadb(query_text, ch, n_results=1):
    if (ch == 1_2):
        results = collection1_2.query(
        query_texts=[query_text],
        n_results=n_results
        )
    elif (ch == 3):
        results = collection3.query(
        query_texts=[query_text],
        n_results=n_results
        )
    elif (ch == 4):
        results = collection4.query(
        query_texts=[query_text],
        n_results=n_results
        )
    elif (ch == 5):
        results = collection5.query(
        query_texts=[query_text],
        n_results=n_results
        )
    elif (ch == 6):
        results = collection6.query(
        query_texts=[query_text],
        n_results=n_results
        )
    return results["documents"], results["ids"]

# RAG pipeline: Combine ChromaDB and Ollama for Retrieval-Augmented Generation
def ragConstruction(queryText, ch, messageHistory=[], userCode=""):

    # Step 1: Retrieve relevant documents from ChromaDB
    retrievedDocs, ids = queryChromadb(queryText, ch)
    context = " ".join(retrievedDocs[0]) if retrievedDocs else "No relevant documents found."

    # Step 2: Send the query along with the context to Ollama
    messages = [
        (
            "system",
            "You are a Tutor for CSC108 - Intro to C++. You are answering questions about C++ coding. Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. If it is a vague question, ask for more information."
        ),
        (
            "context",
            "{}".format(context)
        ),
        (
            "code",
            "{}".format(userCode)
        )
    ]
    
    for message in messageHistory:
        messages.append((message["role"], repr(message["content"])))

    print(messages)
    
    messages.append(("user","{}".format(queryText)))

    llm = ChatOllama(model=llmmodel, base_url=url)

    response = llm.invoke(messages)

    # Why does that have to exist? IDK I hate python, but it throws an error without it.
    response += ""
    
    output = response.messages[0].content
    
    output += "\n Source: "
    output += "".join(ids[0])

    log(queryText, messageHistory, userCode, output)

    return output

#logging function
def log(question, history, code, response):
    try:
        f = open("logs/{}.txt".format(datetime.now()), "w", encoding="utf-8")
        f.write("Question: {}\n\nHistory: {}\n\nCode: {}\n\nResponse: {}".format(question, history, code, response))
        f.close()
    except Exception as e:
        print(e)