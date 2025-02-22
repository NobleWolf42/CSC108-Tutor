function sendMessage() {
    const userMsg = document.getElementById("usrMessage").value;
    const http = new XMLHttpRequest();
    const url = "http://localhost:3006/hello";

    http.open("GET", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("userMsg", userMsg);

    http.onreadystatechange = function () {
        //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            document.getElementById("usrMessage").value = "";
            document.getElementById("messageHistory").innerHTML =
                document.getElementById("messageHistory").innerHTML +
                '<div class="message"><div class="humanMessage">' +
                userMsg +
                "</div></div>";
            receiveMessage(this.responseText);
        } else if (http.readyState == 4 && http.status != 200) {
            document.getElementById("messageHistory").innerHTML =
                document.getElementById("messageHistory").innerHTML +
                '<div class="message"><div class="errorMessage">' +
                "Something Failed" +
                "</div></div>";
        }
    };

    http.send();
}

function receiveMessage(receivedMsg) {
    document.getElementById("messageHistory").innerHTML =
        document.getElementById("messageHistory").innerHTML +
        '<div class="message"><div class="botMessage">' +
        receivedMsg +
        "</div></div>";
}

//For reference from old code
function sendMail() {
    var sender = document.getElementById("sender").value;
    var subject = document.getElementById("subject").value;
    var body = document.getElementById("body").value;
    var flname = document.getElementById("flname").value;
    var resume = document.getElementById("resumeyn").checked;

    var http = new XMLHttpRequest();

    var url = "../mail.php";
    var params = `?sub=${subject}&body=${body}&sender=${sender}&name=${flname}&resume=${resume}`;
    var urlp = url + params;
    http.open("POST", urlp, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function () {
        //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            document.getElementById("alerts").innerHTML =
                '<span style="color: #519D48">Message Sent Successfully.</span>';
            document.getElementById("subbutton").removeAttribute("enabled", "");
            document.getElementById("subbutton").setAttribute("disabled", "");
            setTimeout(function () {
                document.getElementById("alerts").innerHTML = "&nbsp;";
                document
                    .getElementById("subbutton")
                    .setAttribute("enabled", "");
                document
                    .getElementById("subbutton")
                    .removeAttribute("disabled", "");
            }, 20000);
            //alert(http.responseText);
        } else {
            document.getElementById("alerts").innerHTML =
                '<span style="color: #D13B3B">Failed to Send Message, Please Try again.</span>';
            setTimeout(function () {
                document.getElementById("alerts").innerHTML = "&nbsp;";
            }, 15000);
        }
    };
    console.log(params);
    http.send();
}
