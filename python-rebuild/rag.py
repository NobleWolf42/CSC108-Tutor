# Import required libraries
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import OllamaEmbeddings, OllamaLLM
import chromadb
import os

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

# Declare global vars
llmmodel = "llama3.2"

# Initialize ChromaDB
chromaClient = chromadb.PersistentClient(path=os.path.join(os.getcwd(), "chroma_db")) # This remembers data in-between runs

# Initialize the embedding function with Ollama embeddings
embedding = ChromaDBEmbeddingFunction(
    OllamaEmbeddings(
        model=llmmodel,
        base_url="http://localhost:11434"
    )
)

# Define a collection for the RAG workflow
collection = chromaClient.get_or_create_collection(
    name="zybooks_cpp_chapters_1_2",
    metadata={"description": "A collection for RAG with Ollama - Chapters 1 and 2 of Zybooks C++"},
    embedding_function=embedding  # Use the custom embedding function
)
    
# Function to add documents to the ChromaDB collection
def addDocumentsToCollection(documents, ids):
    collection.add(
        documents=documents,
        ids=ids
    )

# Initialise the RAG backend
def initializeRAG():
    
    #Add documents to the collection
    documents = []
    docIds = []
    folderPath = os.path.join(os.path.dirname(__file__), "data")
    
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
    addDocumentsToCollection(documents, docIds)
    return

# Function to query the ChromaDB collection
def queryChromadb(query_text, n_results=1):
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
    return results["documents"], results["ids"]

# Function to interact with the Ollama LLM
def queryOllama(prompt):
    llm = OllamaLLM(model=llmmodel)
    return llm.invoke(prompt)

# RAG pipeline: Combine ChromaDB and Ollama for Retrieval-Augmented Generation
def ragConstruction(queryText, messageHistory="", userCode=""):
    template = """Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\n This is you message history:{history}\n\nThis is the user's code: {code}\n\nQuestion: {question}\nHelpful Answer:"""
    
    prompt = ChatPromptTemplate.from_template(template)
    
    model = OllamaLLM(model=llmmodel)
    
    chain = prompt | model

    # Step 1: Retrieve relevant documents from ChromaDB
    retrievedDocs, ids = queryChromadb(queryText)
    context = " ".join(retrievedDocs[0]) if retrievedDocs else "No relevant documents found."

    # Step 2: Send the query along with the context to Ollama
    augmentedPrompt = f"Context: {context}\n\nHistory: {messageHistory}\n\nQuestion: {queryText}\nAnswer:"
    #print("######## Augmented Prompt ########")
    #print(augmentedPrompt)

    response = chain.invoke({"question":queryText,"context": context, "history": messageHistory, "code":userCode})
    
    if (retrievedDocs):
        response += "\n Source: "
        response += "".join(ids[0])

    return response