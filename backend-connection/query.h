#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>
#include <filesystem>

// POPPLER (for PDF to text)
#include "./poppler/poppler-document.h"
#include "poppler-page.h"

// HNSWLIB
#include "hnswlib.h"
#include "ollama.hpp"

//extract embed store HNSWLib query


// call to Ollama
//[original basic queryOllama]
std::string queryOllama(std::string input, std::string userCode)
{
    std::string response = ollama::generate("llama3.2", input);
    std::cout << "Response from Ollama: " << response << std::endl
              << std::endl;
    return response;
}


// load & extract text from the PDF document using Poppler

namespace fs = std::filesystem;

bool extractTextFromPDF(const std::string& pdfPath, std::string& outText) {
    
    std::string pdfPath = R"(C:\Users\jstev\OneDrive\Desktop\CSC108-Tutor\data)";

    auto doc = poppler::document::load_from_file(pdfPath);
    if (!doc) {
        std::cerr << "Error: Could not open PDF at " << pdfPath << std::endl;
        return false;
    }

    int numPages = doc->pages();
    for (int i = 0; i < numPages; i++) {
        std::unique_ptr<poppler::page> page(doc->create_page(i));
        if (page) {
            // page->text().to_utf8() returns poppler::byte_array
            poppler::byte_array ba = page->text().to_utf8();

            // Convert poppler::byte_array => std::string
            std::string chunk(reinterpret_cast<const char*>(ba.data()), ba.size());

            outText += chunk;
            outText.push_back('\n');
        }
    }
    return true;
}



// embedding with ollama

std::string pdfText, pdfPath;
bool ok = extractTextFromPDF(pdfPath, pdfText);

std::vector<float> embedTextWithOllama(const std::string& text, const std::string& myModel)
{
    // 1) Call Ollama's "generate_embeddings"
    //    This is the free function from your snippet, e.g.
    //    ollama::response generate_embeddings(const std::string&, const std::string&, ...)
    
    ollama::response embResp = ollama::generate_embeddings("llama3.2", text);

    // 2) Parse the float vector from embResp
    //    We'll assume there's a method called get_embeddings()
    
    std::vector<float> embedding = embResp;              //***** not sure what to do with this  */

    // 3) Return it
    return embedding;




// std::vector<float> embedText(const std::string& text, int dimension) {
//     std::vector<float> embedding(dimension, 0.0f);
//     return embedding;
// }