// ==UserScript==
// @name         Codeforces Dark Theme
// @version      1.0.0
// @description  A sleek, modern dark theme for Codeforces.
// @author       NerdBlud
// @match        https://codeforces.com/*
// @match        http://codeforces.com/*
// @match        https://calendar.google.com/calendar/embed*
// @resource     mainCSS   main.css
// @resource     desertCSS desert.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// ==/UserScript==

(function () {
    "use strict";

    const mainStyles = GM_getResourceText("mainCSS");
    const syntaxStyles = GM_getResourceText("desertCSS");
    
    GM_addStyle(mainStyles);
    GM_addStyle(syntaxStyles);

    function observeAndStyle(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Ensure it's an element
                        if (node.matches(selector)) callback(node);
                        const children = node.querySelectorAll(selector);
                        children.forEach(callback);
                    }
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    observeAndStyle("#editor", (editor) => {
        editor.classList.remove("ace-chrome");
        editor.classList.add("ace-monokai");
        
        const classObserver = new MutationObserver(() => {
            if (editor.classList.contains("ace-chrome")) {
                editor.classList.remove("ace-chrome");
                editor.classList.add("ace-monokai");
            }
        });
        classObserver.observe(editor, { attributes: true, attributeFilter: ["class"] });
    });

    observeAndStyle(".MathJax", (mj) => {
        mj.style.filter = "none";
        mj.style.color = "var(--text-bright)";
    });

    if (window.location.hostname === "calendar.google.com") {
        GM_addStyle(`
            body { background: #0d1117 !important; filter: invert(0.9) hue-rotate(180deg); }
            img, iframe { filter: invert(1) hue-rotate(180deg); }
        `);
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (document.title.includes("Not Found") || document.body.innerText.includes("not found on this server")) {
            document.body.classList.add("notfoundpage");
        }

        const lava = document.querySelector(".backLava");
        if (lava) {
            lava.style.opacity = "0.5"; 
        }
    });

})();