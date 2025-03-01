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

///////////////////////////////////////////////////////////////////////////////
// 1. PDF extraction using Poppler
///////////////////////////////////////////////////////////////////////////////
bool extractTextFromPDF(const std::string& pdfPath, std::string& outText) {
    // Load the PDF document using Poppler
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



///////////////////////////////////////////////////////////////////////////////
// 3. Placeholder embedding function
//    In real usage, replace this with a call to your embedding model.
///////////////////////////////////////////////////////////////////////////////
std::vector<float> embedText(const std::string& text, int dimension) {
    // Returns a vector of zeros for demonstration
    std::vector<float> embedding(dimension, 0.0f);
    return embedding;
}

int main(int argc, char** argv) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <path_to_pdf>" << std::endl;
        return 1;
    }

    std::string pdfPath = argv[1];

    // 1) Extract text from PDF
    std::string pdfText;
    if (!extractTextFromPDF(pdfPath, pdfText)) {
        std::cerr << "Failed to extract text from PDF.\n";
        return 1;
    }
    std::cout << "PDF text length: " << pdfText.size() << " characters.\n";

    // 2) Chunk the text
    // auto chunks = chunkText(pdfText, 1000);
    // std::cout << "Created " << chunks.size() << " chunks.\n";

    // 3) Embed each chunk
    int dimension = 384;  // example embedding dimension
    std::vector<std::vector<float>> embeddings;
    embeddings.reserve(chunks.size());
    for (const auto& c : chunks) {
        embeddings.push_back(embedText(c, dimension));
    }

    // 4) Build an HNSW index in memory
    int maxElements = static_cast<int>(chunks.size());
    hnswlib::L2Space space(dimension);
    hnswlib::HierarchicalNSW<float> index(&space, maxElements, 16, 200);

    for (int i = 0; i < maxElements; i++) {
        index.addPoint(embeddings[i].data(), i);
    }

    // 5) Query the index with a user question
    std::string userQuestion = "Explain the main idea of the chapter in the PDF.";
    auto queryEmbedding = embedText(userQuestion, dimension);

    index.setEf(50); // search param
    int k = 3;
    auto results = index.searchKnn(queryEmbedding.data(), k);

    // 6) Show the top matches
    std::cout << "\nTop " << k << " matches for query: \"" << userQuestion << "\"\n";
    while (!results.empty()) {
        auto& result = results.top();
        float distance = result.first;
        int label = result.second;
        results.pop();

        std::cout << " - Chunk ID: " << label << ", Distance: " << distance << "\n";
        // Print partial chunk text
        const auto& chunkText = chunks[label];
        std::string snippet = chunkText.substr(0, 200);
        std::cout << "   \"" << snippet << (chunkText.size() > 200 ? "..." : "") << "\"\n\n";
    }

    std::cout << "Done.\n";
    return 0;
}
