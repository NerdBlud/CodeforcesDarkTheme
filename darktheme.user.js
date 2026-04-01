// ==UserScript==
// @name         Codeforces Dark Theme
// @version      1.0.0
// @description  A sleek, performance-optimized dark theme for Codeforces.
// @author       Nerdblud
// @match        https://codeforces.com/*
// @match        http://codeforces.com/*
// @resource     mainCSS   https://raw.githubusercontent.com/nerdblud/CodeForcesDarkTheme/main/main.css
// @resource     syntaxCSS https://raw.githubusercontent.com/nerdblud/CodeForcesDarkTheme/main/desert.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/nerdblud/CodeForcesDarkTheme/main/darktheme.user.js
// @updateURL    https://raw.githubusercontent.com/nerdblud/CodeForcesDarkTheme/main/darktheme.user.js
// ==/UserScript==

(function () {
    "use strict";

    try {
        const mainStyles = GM_getResourceText("mainCSS");
        const syntaxStyles = GM_getResourceText("syntaxCSS");

        if (mainStyles) GM_addStyle(mainStyles);
        if (syntaxStyles) GM_addStyle(syntaxStyles);
    } catch (e) {
        console.error("Codeforces Theme: Failed to load external CSS resources.", e);
    }

    function observeAndStyle(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches(selector)) callback(node);
                        node.querySelectorAll(selector).forEach(callback);
                    }
                });
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
        mj.style.color = "var(--text-bright)";
    });

    document.addEventListener("DOMContentLoaded", () => {
        const lava = document.querySelector(".backLava");
        if (lava) lava.style.opacity = "0.4";
    });

})();