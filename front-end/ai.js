//#region Global Var for storing chat history and url of backend
let chatHistory = [];
const url = "http://localhost:5000";
//#endregion

//#region This handles the event listeners for the page
document.addEventListener("DOMContentLoaded", () => {
    const oldChat = localStorage.getItem("bcitchatHistory");
    const lastChapter = localStorage.getItem("bcitchap");
    const uCode = localStorage.getItem("bcitcode");

    if (oldChat != null && oldChat != "") {
        const messageHistory = document.getElementById("messageHistory");
        chatHistory = JSON.parse(oldChat).chatHistory;
        for (item of chatHistory) {
            if (item.role == "user") {
                messageHistory.innerHTML =
                    messageHistory.innerHTML +
                    '<div class="message"><div class="humanMessage">' +
                    item.content +
                    "</div></div>";
            } else if (item.role == "assistant") {
                messageHistory.innerHTML =
                    messageHistory.innerHTML +
                    '<div class="message"><div id="" class="botMessage">' +
                    setMaxWidth(
                        DOMPurify.sanitize(marked.parse(item.content))
                    ) +
                    "</div></div>";
            }
        }
    }

    if (lastChapter != null && lastChapter != "") {
        document.getElementById("chapterSelect").value = lastChapter;
    }

    if (uCode != null && uCode != "") {
        document.getElementById("codeMessage").value = uCode;
    }

    document.getElementById("usrMessage").addEventListener("keypress", (x) => {
        if (x.key === "Enter" && !x.shiftKey) {
            x.preventDefault();
            sendMessage();
        }
    });

    document.getElementById("codeMessage").addEventListener("keydown", (x) => {
        if (x.key === "Tab" && !x.shiftKey) {
            const elem = document.getElementById("codeMessage");
            x.preventDefault();
            const beforeText = elem.selectionStart;
            const afterText = elem.selectionEnd;
            elem.value =
                elem.value.substring(0, beforeText) +
                "    " +
                elem.value.substring(afterText);
            elem.selectionEnd = beforeText + 4;
        }
    });
});
//#endregion

//#region This clears the chat history
function clearHistory() {
    chatHistory = [];
    document.getElementById("messageHistory").innerHTML = "";
    localStorage.setItem("bcitchatHistory", "");
}
//#endregion

//#region This sends and receives info from the AI backend
function sendMessage() {
    const userMsg = document.getElementById("usrMessage");
    const subButton = document.getElementById("subbutton");
    const messageHistory = document.getElementById("messageHistory");
    const subButtonType = document.getElementById("subButtonType");
    const userMsgValue = userMsg.value;
    const userCodeValue = document.getElementById("codeMessage").value;
    const chapterValue = document.getElementById("chapterSelect").value;

    localStorage.setItem("bcitchap", chapterValue);
    localStorage.setItem("bcitcode", userCodeValue);

    const http = new XMLHttpRequest();

    userMsg.value = "";
    messageHistory.innerHTML =
        messageHistory.innerHTML +
        '<div class="message"><div class="humanMessage">' +
        userMsgValue +
        "</div></div>";
    messageHistory.innerHTML =
        messageHistory.innerHTML +
        '<div class="message"><div id="lastBotMessage" class="botMessage"><div class="typing">&nbsp;<span class="typeHere"></span><span class="typeHere"></span><span class="typeHere"></span></div></div></div>';

    subButton.removeAttribute("enabled", "");
    subButton.setAttribute("disabled", "");
    subButton.value = "";
    subButtonType.innerHTML =
        '<div class="typingButton"><span class="typeHere"></span><span class="typeHere"></span><span class="typeHere"></span></div>';

    messageHistory.scrollTo({
        top: document.getElementById("lastBotMessage").offsetTop,
        behavior: "smooth",
    });

    http.open("POST", url + "/questions", true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("userMsg", userMsgValue);

    http.onreadystatechange = function () {
        //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            chatHistory.push({ role: "user", content: userMsgValue });
            chatHistory.push({ role: "assistant", content: http.responseText });

            localStorage.setItem("bcitchatHistory", "");
            localStorage.setItem(
                "bcitchatHistory",
                JSON.stringify({ chatHistory: chatHistory })
            );

            document.getElementById("lastBotMessage").innerHTML = setMaxWidth(
                DOMPurify.sanitize(marked.parse(http.responseText))
            );
            messageHistory.scrollTo({
                top: document.getElementById("lastBotMessage").offsetTop,
                behavior: "smooth",
            });
            document.getElementById("lastBotMessage").setAttribute("id", "");

            subButton.setAttribute("enabled", "");
            subButton.removeAttribute("disabled", "");
            subButton.value = "Send";
            subButtonType.innerHTML = "";
        } else if (http.readyState == 4 && http.status != 200) {
            document.getElementById("lastBotMessage").innerHTML =
                "An error has occurred, please try again.";
            document
                .getElementById("lastBotMessage")
                .setAttribute("class", "errorMessage");
            messageHistory.scrollTo({
                top: document.getElementById("lastBotMessage").offsetTop,
                behavior: "smooth",
            });
            document.getElementById("lastBotMessage").setAttribute("id", "");

            subButton.setAttribute("enabled", "");
            subButton.removeAttribute("disabled", "");
            subButton.value = "Send";
            subButtonType.innerHTML = "";
        }
    };

    const data = {
        code: userCodeValue,
        chatHistory: chatHistory,
        chapter: chapterValue,
    };

    http.send(JSON.stringify(data));
}
//#endregion

//#region Set Max width of bot markdown
function setMaxWidth(text) {
    const codeRegex = /<code/g;
    return text.replace(codeRegex, '<code style="white-space: pre-wrap;"');
}
//#endregion

//#region This sends to and receives from the code compiler API
async function runCode() {
    const runButton = document.getElementById("runbutton");
    const outputHere = document.getElementById("outputHere");
    const runButtonType = document.getElementById("runButtonType");
    const userCodeValue = document.getElementById("codeMessage").value;
    const userInput = document.getElementById("usrInput").value;
    /*const userCodeNewLine = userCode.replace(/\r\n|\r|\n/g, "\\n");
    const userCodeNoQuote = userCodeNewLine.replace(/"/g, '\\"');*/

    localStorage.setItem("bcitcode", userCodeValue);

    const http = new XMLHttpRequest();

    runButton.removeAttribute("enabled", "");
    runButton.setAttribute("disabled", "");
    runButton.value = "";
    runButtonType.innerHTML =
        '<div class="typingButton"><span class="typeHere"></span><span class="typeHere"></span><span class="typeHere"></span></div>';

    outputHere.innerHTML = "";
    TypeWriterAnimation(outputHere, "Running...").type();
    await new Promise((r) => setTimeout(r, 2000));
    outputHere.innerHTML = outputHere.innerHTML + "<br><br>";

    http.open("POST", url + "/code", true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "text/plain");
    http.setRequestHeader("userInput", userInput);

    http.onreadystatechange = function () {
        //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            const res = JSON.parse(http.response);
            if (res.error == null && res.output != null) {
                TypeWriterAnimation(outputHere, res.output).type();
            } else if (res.error != null) {
                TypeWriterAnimation(
                    outputHere,
                    `<span class="codeError">Error:</span> ${res.error}`
                ).type();
            } else {
                TypeWriterAnimation(
                    outputHere,
                    '<span class="codeError">An error has occurred reading the response, please try again.</span>'
                ).type();
            }
        } else if (http.readyState == 4 && http.status != 200) {
            TypeWriterAnimation(
                outputHere,
                '<span class="codeError">An error has occurred, please try again.</span>'
            ).type();
        }
    };

    http.send(userCodeValue);
}
//#endregion

//#region TypeWriter Animation Control
function TypeWriterAnimation(elem, text) {
    //#region Initial Variables

    //Initial Cursor Position in the code
    var cursorPosition = 0,
        tag = "",
        writingTag = false,
        tagOpen = false,
        //Type Speed in Milliseconds
        typeSpeed = 75,
        //Resting Type Speed LEAVE THIS AT 0
        tempTypeSpeed = 0;

    //#endregion

    //#region Typing Function
    var type = function () {
        //#region Logic to control the typing so it does not type out stuff that doesn't exist
        if (writingTag === true) {
            tag += text[cursorPosition];
        }

        if (text[cursorPosition] === "<") {
            tempTypeSpeed = 0;
            if (tagOpen) {
                tagOpen = false;
                writingTag = true;
            } else {
                tag = "";
                tagOpen = true;
                writingTag = true;
                tag += text[cursorPosition];
            }
        }
        if (!writingTag) {
            if (text[cursorPosition] === " ") {
                tempTypeSpeed = 150;
            } else {
                tempTypeSpeed = typeSpeed;
            }
            tag.innerHTML += text[cursorPosition];
        }
        if (!writingTag && !tagOpen) {
            if (text[cursorPosition] === " ") {
                tempTypeSpeed = 150;
            } else {
                tempTypeSpeed = typeSpeed;
            }
            elem.innerHTML += text[cursorPosition];
        }
        if (writingTag === true && text[cursorPosition] === ">") {
            tempTypeSpeed = typeSpeed;
            writingTag = false;
            if (tagOpen) {
                var newSpan = document.createElement("span");
                elem.appendChild(newSpan);
                newSpan.innerHTML = tag;
                tag = newSpan.firstChild;
            }
        }

        cursorPosition += 1;
        if (cursorPosition < text.length) {
            setTimeout(type, tempTypeSpeed);
        } else if (text != "Running...") {
            const runButton = document.getElementById("runbutton");
            runButton.setAttribute("enabled", "");
            runButton.removeAttribute("disabled", "");
            runButton.value = "Run";
            document.getElementById("runButtonType").innerHTML = "";
        }

        //#endregion
    };
    return {
        type: type,
    };
    //#endregion
}
//#endregion
