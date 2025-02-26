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

function runCode() {
    const userInput = document.getElementById("usrInput").value;
    const userCode = document.getElementById("codeMessage").value;
    const userCodeNewLine = userCode.replace(/\r\n|\r|\n/g, "\\n");
    const userCodeNoQuote = userCodeNewLine.replace(/"/g, '\\"');
    const http = new XMLHttpRequest();
    const url = "https://bencarpenterit.com:3006/code";

    document.getElementById("codeOutput").innerHTML = "Animations Here";

    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "text/plain");
    http.setRequestHeader("userInput", userInput);

    http.onreadystatechange = function () {
        //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            const res = JSON.parse(http.response);
            if (res.error == null && res.output != null) {
                document.getElementById("codeOutput").innerHTML = res.output;
            } else if (res.error != null) {
                document.getElementById(
                    "codeOutput"
                ).innerHTML = `<span class="codeError">Error:</span> ${res.error}`;
            } else {
                document.getElementById("codeOutput").innerHTML =
                    '<span class="codeError">An error has occurred reading the response, please try again.</span>';
            }
        } else if (http.readyState == 4 && http.status != 200) {
            document.getElementById("codeOutput").innerHTML =
                '<span class="codeError">An error has occurred, please try again.</span>';
        }
    };

    http.send(userCodeNoQuote);
}
