#include <iostream>
#include "ollama.hpp"

std::string queryOllama(std::string input, std::string userCode)
{
    std::string response = ollama::generate("llama3.2", input);
    std::cout << "Response from Ollama: " << response << std::endl
              << std::endl;
    return response;
}



