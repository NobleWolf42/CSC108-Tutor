#include <iostream>
#include <fstream>
#include "ollama.hpp"

// POPPLER (for PDF to text)

// Querys Ollama and returns plain text
std::string queryOllama(std::string input, std::string userCode)
{
    std::string response = ollama::generate("llama3.2", input);
    std::cout << "Response from Ollama: " << response << std::endl
              << std::endl;
    return response;
}

// Generate embeddings call to Ollama and returns only the embeddings
std::string embedOllama(std::string docText)
{
    return ollama::generate_embeddings("llama3.2", docText).as_json()["embeddings"];
}

// Extract text from the TXT document
std::string extractTextFromTXT(const std::string txtPath)
{
    std::ifstream txtFile(txtPath);
    if (!txtFile)
    {
        std::cerr << "Error: Could not open TXT at " << txtPath << std::endl;
        return "";
    }

    std::stringstream outText;

    outText << txtFile.rdbuf();

    return outText.str();
}