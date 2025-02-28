#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>

// POPPLER (for PDF to text)
#include "poppler-document.h"
#include "poppler-page.h"

// HNSWLIB
#include "hnswlib.h"
#include "ollama.hpp"




// call to Ollama

std::string queryOllama(std::string input, std::string userCode)
{
    std::string response = ollama::generate("llama3.2", input);
    std::cout << "Response from Ollama: " << response << std::endl
              << std::endl;
    return response;
}


// load the PDF document using Poppler

bool extractTextFromPDF(const std::string& pdfPath, std::string& outText) {
    
    auto doc = poppler::document::load_from_file(pdfPath);
    if (!doc) {
        std::cerr << "Error: Could not open PDF: " << pdfPath << std::endl;
        return false;
    }

    // Iterate over pages and extract text
    int numPages = doc->pages();
    for (int i = 0; i < numPages; i++) {
        std::unique_ptr<poppler::page> page(doc->create_page(i));
        if (page) {
            outText += page->text().to_latin1() + "\n";
        }
    }

    return true;
}


// simple chunking function

std::vector<std::string> chunkText(const std::string& fullText, size_t maxChunkSize = 1000) {
    std::vector<std::string> chunks;
    size_t start = 0;
    while (start < fullText.size()) {
        size_t end = std::min(start + maxChunkSize, fullText.size());
        chunks.push_back(fullText.substr(start, end - start));
        start = end;
    }
    return chunks;
}



