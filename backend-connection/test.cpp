#include <iostream>
#include "query.h"

int main()
{

    std::string input;
    bool done = false;
    std::string test = "this is a test";


    while (!done)
    {
        std::getline(std::cin, input);
        if (input == "stop")
        {
            done = true;
        }
        else
        {
            std::cout << "Response from Ollama: " << queryOllama(input,test) << std::endl;
        }
    }
    return 0;
}
