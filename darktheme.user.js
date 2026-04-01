// ==UserScript==
// @name         Codeforces Dark Theme (Final Logo Fix)
// @version      1.3.1
// @description  A performance dark theme for Codeforces with correct RAW logo replacement.
// @author       Nerdblud
// @match        https://codeforces.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const NEW_LOGO_URL = "https://raw.githubusercontent.com/nerdblud/nerdblud/main/new_logo.png";

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

    const applyGlobalDarkForce = (node) => {
        if (!node || node.nodeType !== 1) return;
        if (node.classList.contains('rated-user')) return;
        if (node.tagName === 'IMG') return;

        const bgColor = window.getComputedStyle(node).backgroundColor;
        if (bgColor === 'rgb(255, 255, 255)' || bgColor === 'white') {
            node.style.setProperty('background-color', '#050505', 'important');
        }

        const textColor = window.getComputedStyle(node).color;
        if (textColor === 'rgb(0, 0, 0)' || textColor === 'black') {
            node.style.setProperty('color', '#ffffff', 'important');
        }
    };

    const runObserver = () => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        applyGlobalDarkForce(node);
                        node.querySelectorAll('*').forEach(applyGlobalDarkForce);

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
    };
    runObserver();

    const replaceLogo = () => {
        const logoImg = document.querySelector('#header > div:first-child a > img');

        if (logoImg && logoImg.src !== NEW_LOGO_URL) {
            logoImg.src = NEW_LOGO_URL;

            logoImg.style.filter = "none";
            logoImg.style.backgroundColor = "transparent";

            logoImg.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.1)";

            console.log("Codeforces Theme: RAW Logo Swap Successful.");
        }
    };

    document.addEventListener("DOMContentLoaded", replaceLogo);
    window.addEventListener('load', replaceLogo);

})();