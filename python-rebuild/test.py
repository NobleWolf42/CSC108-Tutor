from rag import ragConstruction, initializeRAG

initializeRAG()

print(ragConstruction("How do I instantiate a c++ variable?", [{
      "role": "user",
      "content": "why is the sky blue?"
    }, {
    "role": "assistant",
    "content": "The sky is blue because of magic."
  }] ,""))