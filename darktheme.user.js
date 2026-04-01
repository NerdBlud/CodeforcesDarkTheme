// ==UserScript==
// @name         Codeforces Ultimate Dark Theme
// @version      1.5.0
// @description  A sleek dark theme for Codeforces targeting logo by alt/title attributes.
// @author       Nerdblud
// @match        https://codeforces.com/*
// @match        http://codeforces.com/*
// @resource     mainCSS   https://raw.githubusercontent.com/nerdblud/CodeForcesDarkTheme/main/main.css
// @resource     syntaxCSS https://raw.githubusercontent.com/nerdblud/CodeForcesDarkTheme/main/desert.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// ==/UserScript==

(function () {
    "use strict";

    const NEW_LOGO_URL = "https://raw.githubusercontent.com/nerdblud/CodeForcesDarkTheme/main/imgs/new_logo.png";

    const injectStyles = () => {
        try {
            const mainStyles = GM_getResourceText("mainCSS");
            const syntaxStyles = GM_getResourceText("syntaxCSS");
            if (mainStyles) GM_addStyle(mainStyles);
            if (syntaxStyles) GM_addStyle(syntaxStyles);
        } catch (e) {
            console.error("Codeforces Theme: CSS Injection Failed.", e);
        }
    };
    injectStyles();

    const forceDark = (el) => {
        if (!el || !el.style) return;

        if (el.classList.contains('rated-user')) return;

        if (el.tagName === 'IMG') {
            // TARGET LOGO BY ALT OR TITLE ATTRIBUTES
            const altText = el.getAttribute('alt') || "";
            const titleText = el.getAttribute('title') || "";

            if (altText === "Codeforces" || titleText === "Codeforces") {
                if (el.src !== NEW_LOGO_URL) {
                    el.src = NEW_LOGO_URL;
                    el.style.filter = "none";
                    el.style.backgroundColor = "transparent";
                }
            }
            return; 
        }

        const bgColor = window.getComputedStyle(el).backgroundColor;
        if (bgColor === 'rgb(255, 255, 255)' || bgColor === 'white' || el.id === 'header') {
            el.style.setProperty('background-color', '#050505', 'important');
        }

        const textColor = window.getComputedStyle(el).color;
        if (textColor === 'rgb(0, 0, 0)' || textColor === 'black') {
            el.style.setProperty('color', '#ffffff', 'important');
        }
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    forceDark(node);
                    node.querySelectorAll('*').forEach(forceDark);

                    if (node.id === "editor" || node.querySelector("#editor")) {
                        const editor = node.id === "editor" ? node : node.querySelector("#editor");
                        editor.classList.remove("ace-chrome");
                        editor.classList.add("ace-monokai");
                    }
                }
            });
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.backLava').forEach(lava => lava.style.opacity = "0.2");
        document.querySelectorAll('div, p, span, td, img, #header').forEach(forceDark);
    });

})();