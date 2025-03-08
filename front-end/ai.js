document.addEventListener("DOMContentLoaded", () => {
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

function sendMessage() {
    document.getElementById("subbutton").enabled = false;
    document.getElementById("subbutton").disabled = true;

    const userMsg = document.getElementById("usrMessage").value;
    const userCode = document.getElementById("codeMessage").value;
    const http = new XMLHttpRequest();
    const url = "http://127.0.0.1:5000/questions";

    document.getElementById("usrMessage").value = "";
    document.getElementById("messageHistory").innerHTML =
        document.getElementById("messageHistory").innerHTML +
        '<div class="message"><div class="humanMessage">' +
        userMsg +
        "</div></div>";
    document.getElementById("messageHistory").innerHTML =
        document.getElementById("messageHistory").innerHTML +
        '<div class="message"><div id="lastBotMessage" class="botMessage">' +
        "Animations Here" +
        "</div></div>";

    document.getElementById("messageHistory").scrollTop =
        document.getElementById("messageHistory").scrollHeight;

    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "text/plain");
    http.setRequestHeader("userMsg", userMsg);

    http.onreadystatechange = function () {
        //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            document.getElementById("lastBotMessage").innerHTML =
                http.responseText;
            document.getElementById("lastBotMessage").setAttribute("id", "");
            document.getElementById("messageHistory").scrollTop =
                document.getElementById("messageHistory").scrollHeight;
        } else if (http.readyState == 4 && http.status != 200) {
            document.getElementById("lastBotMessage").innerHTML =
                "An error has occurred, please try again.";
            document
                .getElementById("lastBotMessage")
                .setAttribute("class", "errorMessage");
            document.getElementById("lastBotMessage").setAttribute("id", "");
            document.getElementById("messageHistory").scrollTop =
                document.getElementById("messageHistory").scrollHeight;
        }

        document.getElementById("subbutton").enabled = true;
        document.getElementById("subbutton").disabled = false;
    };

    http.send(userCode);
}

async function runCode() {
    document.getElementById("runbutton").enabled = false;
    document.getElementById("runbutton").disabled = true;

    const userInput = document.getElementById("usrInput").value;
    const userCode = document.getElementById("codeMessage").value;
    const userCodeNewLine = userCode.replace(/\r\n|\r|\n/g, "\\n");
    const userCodeNoQuote = userCodeNewLine.replace(/"/g, '\\"');
    const http = new XMLHttpRequest();
    const url = "http://127.0.0.1:5000/code";

    document.getElementById("outputHere").innerHTML = "";
    TypeWriterAnimation(
        document.getElementById("outputHere"),
        "Running..."
    ).type();
    await new Promise((r) => setTimeout(r, 2000));
    document.getElementById("outputHere").innerHTML =
        document.getElementById("outputHere").innerHTML + "<br><br>";

    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "text/plain");
    http.setRequestHeader("userInput", userInput);

    http.onreadystatechange = function () {
        //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            const res = JSON.parse(http.response);
            if (res.error == null && res.output != null) {
                TypeWriterAnimation(
                    document.getElementById("outputHere"),
                    res.output
                ).type();
            } else if (res.error != null) {
                TypeWriterAnimation(
                    document.getElementById("outputHere"),
                    `<span class="codeError">Error:</span> ${res.error}`
                ).type();
            } else {
                TypeWriterAnimation(
                    document.getElementById("outputHere"),
                    '<span class="codeError">An error has occurred reading the response, please try again.</span>'
                ).type();
            }
        } else if (http.readyState == 4 && http.status != 200) {
            TypeWriterAnimation(
                document.getElementById("outputHere"),
                '<span class="codeError">An error has occurred, please try again.</span>'
            ).type();
        }
    };

    http.send(userCode);
}

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
            document.getElementById("runbutton").enabled = true;
            document.getElementById("runbutton").disabled = false;
        }

        //#endregion
    };
    return {
        type: type,
    };
    //#endregion
}
//#endregion
