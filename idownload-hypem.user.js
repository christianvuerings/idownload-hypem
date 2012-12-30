// ==UserScript==
// @name iDownload Hypem
// @version 0.2
// @namespace http://denbuzze.com/
// @description Download music from Hypem.com
// @match http://*.hypem.com/*
// @include http://*hypem.com/*
// ==/UserScript==

/*global document, soundManager*/
var exec = function(fn) {
    var script = document.createElement('script');
    script.setAttribute('id', 'idownload');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
};

exec(function() {
    var localhostExists = false;

    var passRequest = function(event, callback) {
        var target = event.currentTarget;
        if (target.readyState === 4 && target.status === 200) {
            if (callback) {
                callback(true);
            }
        } else if (target.readyState === 4) {
            if (callback) {
                callback(false);
            }
        }
    };

    var makeRequest = function(url, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function(event) {
            passRequest(event, callback);
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    };

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
            ' #downloadButton:active { color: #ff0000 !important; }' +
            ' #player-container #player-inner #player-controls #player-nowplaying { max-width: 490px }'
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
            downloadButton.setAttribute('target', '_newtab');
            var downloadText = document.createTextNode('▼');
            downloadButton.appendChild(downloadText);
            var playerFav = document.getElementById('playerFav');
            var parent = playerFav.parentNode;
            parent.insertBefore(downloadButton, playerFav);
        }
    };

    var executeDownload = function(e) {
        var downloadButton = document.getElementById('downloadButton');
        if (localhostExists) {
            e.preventDefault();
            makeRequest(downloadButton.getAttribute('href'));
        }
    };

    /**
     * Set the download link
     * @param {String} url The URL you want to use for the download link
     */
    var setDownloadLink = function(sound) {

        var url = sound.url;
        var filename = '';

        if (localhostExists) {
            if (trackList && trackList[activeList] && trackList[activeList][currentTrack]){
                var currentPlayingTrack = trackList[activeList][currentTrack];
                var addquery = '';
                if (url.indexOf('?') > -1) {
                    addquery = '&';
                } else {
                    addquery = '?';
                }
                filename = addquery + 'filename=' + encodeURIComponent(currentPlayingTrack.artist + ' - ' + currentPlayingTrack.song);
            }
            url = 'http://localhost:5000/download/' + encodeURIComponent(url+filename);
        }

        var downloadButton = document.getElementById('downloadButton');
        if (downloadButton.getAttribute('href') !== url) {
            downloadButton.setAttribute('href', url);
        }
        downloadButton.removeEventListener('click', executeDownload);
        downloadButton.addEventListener('click', executeDownload);
    };

    var checkPlaying = function() {
        var currentSound = soundManager.soundIDs[0];
        if (currentSound) {
            addDownloadButton();
            setDownloadLink(soundManager.sounds[currentSound]);
        }
    };

    var initPolling = function() {
        soundManager.onready(function() {
            setInterval(checkPlaying, 500);
        });
    };

    var checkLocalhostExists = function() {
        makeRequest('http://localhost:5000/exists', function(data) {
            localhostExists = data;
            initPolling();
        });
    };

    var init = function() {
        if (soundManager) {
            checkLocalhostExists();
        }
    };

    init();
});
