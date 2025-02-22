#include <iostream>
#include "ollama.hpp"

int main() {
    
    std::string response = ollama::generate("llama3:8b", "Why is the sky blue?");
    std::cout << "Response from Ollama: " << response << std::endl;
    return 0;
}
