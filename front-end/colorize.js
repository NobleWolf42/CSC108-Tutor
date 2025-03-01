const resizeTextarea = (textArea, highlightArea) => {
    if (!textArea || !highlightArea) {
        return;
    }

    window.requestAnimationFrame(() => {
        highlightArea.style.width = `${textArea.offsetWidth - 3}px`;
        textArea.style.height = 0;
        highlightArea.style.fontSize = window
            .getComputedStyle(document.getElementById("codeMessage"), null)
            .getPropertyValue("font-size");
        if (textArea.scrollHeight > 0) {
            textArea.style.height = `${textArea.scrollHeight + 2}px`;
            highlightArea.style.height = `${textArea.offsetHeight - 3}px`;
        }
    });
};

const highlight = (inputEl, highlightEl) => {
    window.requestAnimationFrame(() => {
        const highlighted = hljs.highlight(inputEl.value, {
            language: "cpp",
        }).value;
        highlightEl.innerHTML = highlighted;
    });
};

const init = (inputEl, highlightEl) => {
    inputEl.addEventListener("input", () => {
        resizeTextarea(inputEl, highlightEl);
        highlight(inputEl, highlightEl);
    });
    window.addEventListener("resize", () => {
        resizeTextarea(inputEl, highlightEl);
        highlight(inputEl, highlightEl);
    });
    window.addEventListener("keydown", () => {
        resizeTextarea(inputEl, highlightEl);
        highlight(inputEl, highlightEl);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const inputEl = document.getElementById("codeMessage");
    const highlightEl = document.getElementById("highlightMe");
    init(inputEl, highlightEl);
    resizeTextarea(inputEl, highlightEl);
    highlight(inputEl, highlightEl);
    highlightEl.style.font = inputEl.style.font;
});
