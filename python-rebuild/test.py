from rag import ragConstruction, initializeRAG

initializeRAG()

print(ragConstruction("how do I use cin?", [{
      "role": "user",
      "content": "why is the sky blue?"
    }, {
    "role": "assistant",
    "content": "The sky is blue because of magic."
  }] ,""))