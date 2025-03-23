#include <iostream>
#include <fstream>
#include <sys/types.h>
#include <filesystem>
#include "ollama.hpp"
#include "usearch/index.hpp"
#include "usearch/index_dense.hpp"

// Generate embeddings call to Ollama and returns only the embeddings
std::vector<float> embedOllama(std::string docText)
{
    nlohmann::json array = ollama::generate_embeddings("llama3.2", docText).as_json()["embeddings"][0];
    std::vector<float> vec = array.get<std::vector<float>>();
    return vec;
}

int findDoc(std::string query, unum::usearch::index_dense_t &index)
{
    std::vector<float> temp = embedOllama(query);
    auto results = index.search(&temp[0], 10);
    if (results.size() > 0)
    {
        return results[0].member.slot;
    }
    return -1;
}

// Querys Ollama and returns plain text
std::string queryOllama(std::string input, std::string userCode, std::vector<std::pair<std::string, std::string>> &docsVec, unum::usearch::index_dense_t &index)
{
    std::string context = "No Document Found";
    int i = findDoc(input, index);
    if (i > -1)
    {
        context = docsVec[i].second;
    }
    std::string augmentedQuery = "Context: " + context + "\n\nHistory: " + "" + "\n\nQuestion: " + input;
    std::string response = ollama::generate("llama3.2", augmentedQuery);
    std::cout << "CONTEXT: " << context << std::endl
              << std::endl;
    if (i > -1)
    {
        response += "\nReference: " + docsVec[i].first;
    }
    return response;
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

void addDocsToVecDB(std::vector<std::pair<std::string, std::string>> &docsVec, unum::usearch::index_dense_t &index)
{
    std::uint64_t i = 0;
    for (const std::pair<std::string, std::string> &pair : docsVec)
    {
        std::vector<float> temp = embedOllama(pair.second);
        index.add(i, &temp[0]);
        i++;
    }
}

void loopDocs(std::string docsPath, std::vector<std::pair<std::string, std::string>> &docsVec, unum::usearch::index_dense_t &index)
{

    int i = 0;

    for (const std::filesystem::directory_entry &entry : std::filesystem::directory_iterator(docsPath))
    {
        i++;
        docsVec.push_back(std::make_pair(entry.path().filename().string(), extractTextFromTXT(entry.path().string())));
    }
    index.reserve(i);

    return;
}

std::string searchDocs(std::string title, std::vector<std::pair<std::string, std::string>> docsVec)
{
    for (const std::pair<std::string, std::string> &pair : docsVec)
    {
        if (pair.first == title)
        {
            return pair.second;
        }
    }
    return "";
}
