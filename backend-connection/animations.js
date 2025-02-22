var currentpage = "home";
var currentproj = "mainproj";

//#region This happens when you click a navigation link
function navClick(topage) {
    console.log('START PAGE - ' + currentpage)
    if (currentpage == "home") {
        fromHomePage(topage);
    }
    else {
        fromPage(topage);
    }
    console.log('END PAGE - ' + currentpage)
}
//#endregion

//#region Translation From Home Page
function fromHomePage(page) {
    console.log("Started Animation");

    selectdelete();
    setTimeout(runall, 1000);
    setTimeout(function(){ document.getElementById('content').classList.remove('fade'); }, 5000);

    if (page == "info") {
        document.getElementById('content').innerHTML = document.getElementById('aboutmecontent').innerHTML;
        document.getElementById('title').innerHTML = "About Me";
    }
    else if (page == 'projects') {
        document.getElementById('content').innerHTML = document.getElementById('projectscontent').innerHTML;
        document.getElementById('title').innerHTML = "Past Projects";
    }
    else if (page == 'history') {
        document.getElementById('content').innerHTML = document.getElementById('historycontent').innerHTML;
        document.getElementById('title').innerHTML = "Job History";
    }
    else if (page == 'contact') {
        document.getElementById('content').innerHTML = document.getElementById('contactcontent').innerHTML;
        document.getElementById('title').innerHTML = "Contact Me";
    }

    var nav = document.getElementById('nav' + page);
    nav.classList.add('current');
    currentpage = page;
    window.scrollTo(0, 0);

    function runall() {
        var menubar = document.getElementById('menubar');
        menubar.classList.add('leaving');
        menubar.classList.add('done');

        var table = document.getElementById('table');
        table.classList.add('leaving');

        var typehere = document.getElementById('typehere');
        typehere.classList.add('leaving');

        var mainnav = document.getElementById('mainnav');
        mainnav.classList.add('leaving');

        var darkenhtml = document.getElementById('darkenhtml');
        darkenhtml.classList.add('leaving');

        var topdark = document.getElementById('topdark');
        topdark.classList.add('leaving');

        var outer = document.getElementById('outer');
        outer.classList.add('leaving');

        var inner = document.getElementById('inner');
        inner.classList.add('leaving');

    }
}
//#endregion

//#region Transition from one page to another
function fromPage(page) {
    console.log("Started Animation");

    fade(page);

    var currentnav = document.getElementById('nav' + currentpage);
    currentnav.classList.remove('current');

    var navpage = document.getElementById('nav' + page);
    navpage.classList.add('current');
    currentpage = page;
}
//#endregion

//#region This transitions back to the home page from other pages
function toHomePage() {
    console.log("Started Animation");

    document.getElementById('title').innerHTML = "Ben Carpenter - IT Professional";

    setTimeout(function(){ document.getElementById('content').innerHTML = ""; }, 2050);

    var menubar = document.getElementById('menubar');
    menubar.classList.remove('leaving')
    menubar.classList.remove('done')

    var table = document.getElementById('table');
    table.classList.remove('leaving');

    var typehere = document.getElementById('typehere');
    typehere.classList.remove('leaving');

    var mainnav = document.getElementById('mainnav');
    mainnav.classList.remove('leaving');

    var typer = document.getElementById("typehere");
    typehere = TypeWriterReadd(typer);
    setTimeout(typehere.type, 6000);

    var content = document.getElementById('content');
    content.classList.add('fade');

    var currentnav = document.getElementById('nav' + currentpage);
    currentnav.classList.remove('current');
    currentpage = "home";

    var darkenhtml = document.getElementById('darkenhtml');
    darkenhtml.classList.remove('leaving');

    var topdark = document.getElementById('topdark');
    topdark.classList.remove('leaving');

    var outer = document.getElementById('outer');
    outer.classList.remove('leaving');

    var inner = document.getElementById('inner');
    inner.classList.remove('leaving');
}
//#endregion

//#region This is the select and delete animation
function selectdelete() {
    document.getElementById('itpro').style.background = '#008000';
    document.getElementById('itpro').style.color = '#000000';

    setTimeout(remove, 800)

    function remove() {
        document.getElementById('typehere').innerHTML = "<a href=\"#\" onclick=\"toHomePage();return false;\"><span id=\"name\">Ben Carpenter</span></a>"
    }
}
//#endregion

//#region TypeWriter Readd Animation Control
function TypeWriterReadd(text) {
    //#region Inital Varibles
    
    // HTML Section that will be typed out
    var HTML = '<span id=\"name\">Ben Carpenter</span><span id="itpro"> - IT Professional</span>';

    //Makes HTML start empty
    text.innerHTML = '<span id=\"name\">Ben Carpenter</span>';

    //Inital Cursor Position in the code
    var cursorPosition = 36,
    tag = "",
    writingTag = false,
    tagOpen = false,

    //Type Speed in Miliseconds
    typeSpeed = 150,

    //Resting Type Speed LEAVE THIS AT 0
    tempTypeSpeed = 0;

    //#endregion

    //#region Typing Function
    var type = function() {
    
        //#region Logic to control the typing so it does not type out stuff that dosnt exist
        if (writingTag === true) {
            tag += HTML[cursorPosition];
        }

        if (HTML[cursorPosition] === "<") {
            tempTypeSpeed = 0;
            if (tagOpen) {
                tagOpen = false;
                writingTag = true;
            } else {
                tag = "";
                tagOpen = true;
                writingTag = true;
                tag += HTML[cursorPosition];
            }
        }
        if (!writingTag && tagOpen) {
            if (HTML[cursorPosition] === " ") {
                tempTypeSpeed = 350;
                console.log("SPACE")
            }
            else {
                tempTypeSpeed =  typeSpeed;
            }
            tag.innerHTML += HTML[cursorPosition];
        }
        if (!writingTag && !tagOpen) {
            if (HTML[cursorPosition] === " ") {
                tempTypeSpeed = 350;
                console.log("SPACE")
            }
            else {
                tempTypeSpeed =  typeSpeed;
            }
            text.innerHTML += HTML[cursorPosition];
        }
        if (writingTag === true && HTML[cursorPosition] === ">") {
            tempTypeSpeed = typeSpeed;
            writingTag = false;
            if (tagOpen) {
                var newSpan = document.createElement("span");
                text.appendChild(newSpan);
                newSpan.innerHTML = tag;
                tag = newSpan.firstChild;
            }
        }

        console.log(tempTypeSpeed, HTML[cursorPosition], cursorPosition, writingTag, tagOpen);
        cursorPosition += 1;
        if (cursorPosition < HTML.length - 1) {
            setTimeout(type, tempTypeSpeed);
        }
        //#endregion
    };
    return {
        type: type
    };
    //#endregion
}
//#endregion

//#region This is the fade out/in animation for switching pages
function fade(page) {
    console.log("fadeout")
    document.getElementById('content').classList.add('fade');

    setTimeout(fadein, 1100);

    function fadein() {
        console.log("fadein")
        document.getElementById('content').classList.remove('fade');

        if (page == "info") {
            document.getElementById('content').innerHTML = document.getElementById('aboutmecontent').innerHTML;
            document.getElementById('title').innerHTML = "About Me";
        }
        else if (page == 'projects') {
            document.getElementById('content').innerHTML = document.getElementById('projectscontent').innerHTML;
            document.getElementById('title').innerHTML = "Past Projects";
        }
        else if (page == 'history') {
            document.getElementById('content').innerHTML = document.getElementById('historycontent').innerHTML;
            document.getElementById('title').innerHTML = "Job History";
        }
        else if (page == 'contact') {
            document.getElementById('content').innerHTML = document.getElementById('contactcontent').innerHTML;
            document.getElementById('title').innerHTML = "Contact Me";
        }

        window.scrollTo(0, 0);
    }
}
//#endregion

//#region This is the code that switches the project information
function projectSelect(projname) {
    console.log("Started Animation");

    projFade(projname);

    var currentnav = document.getElementById('projnav' + currentproj);
    currentnav.classList.remove('current');

    var navpage = document.getElementById('projnav' + projname);
    navpage.classList.add('current');
    currentproj = projname;
}
//#endregion

//#region project fade in/out
function projFade(proj) {
    console.log("fadeout")
    document.getElementById('projecttext').classList.add('fade');

    setTimeout(fadein, 1100);

    function fadein() {
        console.log("fadein")
        document.getElementById('projecttext').classList.remove('fade');
        document.getElementById('projecttext').innerHTML = document.getElementById(proj).innerHTML;
    }
}
//#endregion