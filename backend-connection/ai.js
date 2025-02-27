document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("usrMessage").addEventListener("keypress", (x) => {
        if (x.key === "Enter" && !x.shiftKey) {
            x.preventDefault();
            sendMessage();
        }
    });
});

function sendMessage() {
    const userMsg = document.getElementById("usrMessage").value;
    const userCode = document.getElementById("codeMessage").value;
    const http = new XMLHttpRequest();
    const url = "https://bencarpenterit.com:3006/questions";

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
    };

    http.send(userCode);
}

async function runCode() {
    const userInput = document.getElementById("usrInput").value;
    const userCode = document.getElementById("codeMessage").value;
    const userCodeNewLine = userCode.replace(/\r\n|\r|\n/g, "\\n");
    const userCodeNoQuote = userCodeNewLine.replace(/"/g, '\\"');
    const http = new XMLHttpRequest();
    const url = "https://bencarpenterit.com:3006/code";

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

    http.send(userCodeNoQuote);
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
        }
        //#endregion
    };
    return {
        type: type,
    };
    //#endregion
}
//#endregion
