#include <iostream>
#include "query.h"

int main()
{

    std::string input;
    bool done = false;

    while (!done)
    {
        std::getline(std::cin, input);
        if (input == "stop")
        {
            done = true;
        }
        else
        {
            std::cout << "Response from Ollama: " << queryOllama(input) << std::endl;
        }
    }
    return 0;
}
