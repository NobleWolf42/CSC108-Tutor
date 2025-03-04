#include <iostream>
#include "query.h"

int main()
{

    std::string input;
    bool done = false;
    std::string test = "this is a test";

    while (!done)
    {
        /*std::getline(std::cin, input);
        if (input == "stop")
        {
            done = true;
        }
        else
        {*/
        // std::cout << std::filesystem::current_path().append("../data/Section 1.01.pdf").generic_string() << std::endl;
        std::cout << "Response from Ollama: " << extractTextFromTXT(std::filesystem::current_path().append("../data/Section 1.01.txt").generic_string()) << std::endl;
        done = true;
        //  std::cout << "Response from Ollama: " << queryOllama(input,test) << std::endl;
        // }
    }
    return 0;
}
