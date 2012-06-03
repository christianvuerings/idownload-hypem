// ==UserScript==
// @name iDownload Hypem
// @version 0.1
// @namespace http://denbuzze.com/
// @description Download music from Hypem.com
// @match http://*.hypem.com/*
// @include http://*hypem.com/*
// ==/UserScript==

/*global document, soundManager*/
var exec = function(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
};

exec(function() {

    /**
     * Add CSS to the document
     * @param {String} css The CSS you want to add
     */
    var addGlobalCSS = function(css) {
        var sel = document.createElement('style');
        sel.setAttribute('type','text/css');
        sel.appendChild(document.createTextNode(css));
        var hel = document.documentElement.firstChild;
        while(hel && hel.nodeName!='HEAD') {
            hel = hel.nextSibling;
        }
        if(hel && hel.nodeName=='HEAD') {
            hel.appendChild(sel);
        } else {
            document.body.insertBefore(sel,document.body.firstChild);
        }
        return sel;
    };

    /**
     * Add CSS for the download button
     */
    var addDownloadButtonCSS = function() {
        addGlobalCSS('' +
            ' #downloadButton { border-right: 1px solid #272727; color: #e0e0e0 !important; display: block; float: left; overflow: hidden; font-size: 16px; padding: 7px 7px 5px; }' +
            ' #downloadButton:hover { color: #277be1 !important; text-decoration: none; }' +
            ' #downloadButton:active { color: #ff0000 !important; }'
        );
    };

    /**
     * Add the download button (only when it hasn't been added yet)
     */
    var addDownloadButton = function() {
        if (document.getElementById('downloadButton') === null) {
            addDownloadButtonCSS();
            var downloadButton = document.createElement('a');
            downloadButton.setAttribute('id', 'downloadButton');
            downloadButton.setAttribute('href', '#');
            var downloadText = document.createTextNode('▼');
            downloadButton.appendChild(downloadText);
            var playerFav = document.getElementById('playerFav');
            var parent = playerFav.parentNode;
            parent.insertBefore(downloadButton, playerFav)
        }
    };

    /**
     * Set the download link
     * @param {String} url The URL you want to use for the download link
     */
    var setDownloadLink = function(url) {
        var downloadButton = document.getElementById('downloadButton');
        if (downloadButton.getAttribute('href') !== url) {
            downloadButton.setAttribute('href', url);
        }
    };

    var checkPlaying = function() {
        var currentSound = soundManager.soundIDs[0];
        if (currentSound) {
            addDownloadButton();
            setDownloadLink(soundManager.sounds[currentSound].url);
        }
    };

    var init = function() {
        soundManager.onready(function() {
            setInterval(checkPlaying, 500);
        });
    };
    init();
});
