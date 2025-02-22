#include <iostream>
#include "ollama.hpp"

int main() {
    
    std::string input;
    //std::cin >> input;
    std::getline(std::cin, input);
    std::string response = ollama::generate("llama3.2", input);
    std::cout << "Response from Ollama: " << response << std::endl;
    return 0;
}
