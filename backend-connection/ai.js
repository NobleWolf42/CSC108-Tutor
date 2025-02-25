document.getElementById("usrMessage").addEventListener("keypress", (x) => {
    if (x.key === "Enter" && !x.shiftKey) {
        x.preventDefault();
        sendMessage();
    }
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
