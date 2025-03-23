# 👨‍💻 C++ AI Tutor

>This project was bulit with two main modules, the back-end API, and the frontend display.
> Functional Example lives [here](https://bencarpenterit.com/projects/CSCTutor/).

## 📖 Table of Contents

- [👨‍💻 C++ AI Tutor](#-c-ai-tutor)
  - [📖 Table of Contents](#-table-of-contents)
  - [📝 Features](#-features)
  - [✅ Requirements](#-requirements)
  - [🚀 Getting Started](#-getting-started)
  - [⚙️ Configuration](#️-configuration)
  - [🏎️ Running the Bot](#️-running-the-bot)
  - [📝 API](#-api)
  - [🤝 Sources](#-sources)
      - [Front-End](#front-end)
      - [Back-End](#back-end)

## 📝 Features

-   Relatively simple RAG system for integrations of a data source with [Ollama](https://ollama.com/)

-   Standalone backend makes it easy to integrate it with a pre-existing platform, or build your own

-   Example Front-End ai.js file can be quickly adapted to any other html

## ✅ Requirements

1. [Ollama](https://ollama.com/download)
2. [Python](https://www.python.org/downloads/)
3. [JDoodle API Access](https://www.jdoodle.com/subscribe-api)

## 🚀 Getting Started

```
git clone https://github.com/NobleWolf42/CSC108-Tutor.git
cd CSC108-Tutor
pip install chromadb langchain_ollama flask gevent
ollama pull llama3.2
```

## ⚙️ Configuration

Copy or Rename `setting.config.example` located in the `python-backend` folder to `setting.config` and fill out the values:

⚠️ **Note: Never commit or share your token or api keys publicly** ⚠️

```
PORT(i.e. 3000) JDoodle-API-ID JDoodle-API-Secret
```

## 🏎️ Running the Bot

After installation and configuration you can use `python main.js` to start the bot
> Note: You need to have the front-end hosted locally for it to work, I recommend something like [XAMPP](https://www.apachefriends.org/download.html).

## 📝 API

> If you prefer to use the API with a custom front-end the endpoints and expected data/responses are below

-   /questions

    -   Method: POST `application/json`

        ```json
        {
            "question": "Who are you?",
            "code": "#include <iostream>\n using namespace std;\n\nint main() {\n    cout << \"Hello World!\" << endl;\n}",
            "chatHistory": [{ "role": "user", "content": "user-question" },{ "role": "assistant", "content": "bot-response" },{ "role": "user", "content": "user-question" }, ...],
            "chapter": "chapterIdentifier",
        }
        ```

    -   Response: `text/plain`
   
        ```
        I am an AI!
        ```

-   /code

    -   Method: POST `application/json`

        ```json
        {
            "userInput": "Steve",
            "code": "#include <iostream>\nusing namespace std;\nint main() {\n    string name;\n    cin >> name;\n    cout << \"Hello \" << name << \"!\" << endl;\n}",
            "chatHistory": [{ "role": "user", "content": "user-question" },{ "role": "assistant", "content": "bot-response" },{ "role": "user", "content": "user-question" }, ...],
            "chapter": "chapterIdentifier",
        }
        ```

    -   Response: `application/json`
   
        ```json
        {
            "output": "Hello Steve!",
            "error": null,
            "statusCode": 200,
            "memory": "8192",
            "cpuTime": "0.01",
            "compilationStatus": null,
            "projectKey": null,
            "isExecutionSuccess": true,
            "isCompiled": true
        }
        ```

-   /
    
    - >Note: This is meant to be a url that you can load to test if the server is active.  

    -   Method: GET

    -   Response: `text/plain`
   
        ```
        Hello World!
        ```

## 🤝 Sources

#### Front-End
1. [Marked](https://github.com/markedjs/marked)
2. [DOMPurify](https://github.com/cure53/DOMPurify)
3. [Highlight.JS](https://highlightjs.org/)
4. [Daniel Schulz's Highlight.JS Guide](https://dev.to/iamschulz/a-colorful-textarea-k9d)
5. Typewriter animation, mobile detection, and style from my site: [BenCarpenterIT.com](https://bencarpenterit.com)

#### Back-End
1. [ZyBooks - CSC 108: Computer Science I](https://learn.zybooks.com/zybook/QCCCSC108LoiSpring2025) for the RAG infromation
2. [Arun Patidar's Guide](https://medium.com/@arunpatidar26/rag-chromadb-ollama-python-guide-for-beginners-30857499d0a0) for the starting point of [rag.py](https://github.com/NobleWolf42/CSC108-Tutor/blob/main/python-backend/rag.py)