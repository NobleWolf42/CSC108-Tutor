from rag import ragConstruction, initializeRAG

#initializeRAG()




test = [
    (
        'system',
        "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\nContext: {context}\n\nUser's code: {code}"
        ),
    (
        'user',
        "'How do you use a for loop in c++?'"
        ),
    (
        'assistant',
        '\'In C++, a `for` loop is used to execute a block of code repeatedly for a specified number of times. The basic syntax of a `for` loop is as follows:\\n\\n```cpp\\nfor (initialization; condition; increment/decrement) {\\n    // code to be executed in each iteration\\n}\\n```\\n\\nHere\\\'s a breakdown of the components:\\n\\n*   **Initialization**: This is the expression that is evaluated once at the beginning of the loop. It initializes the variable(s) used in the loop.\\n*   **Condition**: This is the logical expression that is tested after the initialization and before the increment/decrement operation. The loop continues to execute as long as this condition is true.\\n*   **Increment/Decrement**: After the condition is evaluated, the increment or decrement operation is performed on the variable(s) initialized in the initialization step.\\n\\n### Basic Example\\n\\nHere\\\'s a simple `for` loop that prints numbers from 1 to 5:\\n\\n```cpp\\n#include <iostream>\\n\\nint main() {\\n    for (int i = 1; i <= 5; ++i) {\\n        std::cout << i << std::endl;\\n    }\\n    return 0;\\n}\\n```\\n\\nIn this example, `i` is initialized to 1, and the condition `i <= 5` checks whether the loop should continue. If it does, the value of `i` is incremented by 1.\\n\\n### Another Example\\n\\nHere\\\'s a more complex example that demonstrates how to use a `for` loop with an array:\\n\\n```cpp\\n#include <iostream>\\n\\nint main() {\\n    int scores[] = {90, 80, 70, 60};\\n    const int size = sizeof(scores) / sizeof(scores[0]);\\n\\n    for (int i = 0; i < size; ++i) {\\n        std::cout << "Score " << i + 1 << ": " << scores[i] << std::endl;\\n    }\\n\\n    return 0;\\n}\\n```\\n\\nIn this example, the `for` loop iterates over each element in the `scores` array and prints it along with its index. The condition `i < size` ensures that the loop stops when all elements have been processed.\\n\\n### Using Range-Based For Loop\\n\\nC++11 introduced range-based for loops, which provide a more concise way to iterate over arrays or containers:\\n\\n```cpp\\n#include <iostream>\\n\\nint main() {\\n    int scores[] = {90, 80, 70, 60};\\n    const int size = sizeof(scores) / sizeof(scores[0]);\\n\\n    // Range-based for loop\\n    for (const auto& score : scores) {\\n        std::cout << "Score: " << score << std::endl;\\n    }\\n\\n    return 0;\\n}\\n```\\n\\nIn this example, the range-based `for` loop iterates over each element in the `scores` array and binds it to a constant reference named `score`. The loop body is executed for each iteration.\\n Source: Section 2.24\''
        )]

print(ragConstruction("What was my first message?", test ,""))