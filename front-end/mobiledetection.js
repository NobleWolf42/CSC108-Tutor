function setcss() {
    const i = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/;

    if (!i.test(navigator.userAgent)) {
        /*document
            .getElementById("stylesheet")
            .setAttribute("href", "mobilestyle.css");
        document
            .getElementById("typer")
            .setAttribute("src", "mobiletypewriter.css");*/
    }

    //#region Executes the code
    window.onload = document
        .getElementById("myViewport")
        .setAttribute("content", "width=device-width");
    //#endregion
}

setcss();
