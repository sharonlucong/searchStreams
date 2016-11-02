// Global variables
var DOM = {};
var APP = {};

// Callback function
var getStreams = (function() {

    // Initialization, query dom element only once
    DOM.streamsElement = document.getElementById("streams");
    DOM.currentPageElement = document.getElementById("currentPage");
    DOM.streamsLengthElement = document.getElementById("streamsLength");
    DOM.totalPagesElement = document.getElementById("totalPages");
    DOM.gameInputElement = document.getElementById("gameSearchInput");
    DOM.channelInputElement = document.getElementById("channelSearchInput");
    DOM.limitSearchInputElement = document.getElementById("limitSearchInput");

    DOM.warningElement = document.createElement("div");
    DOM.warningElement.classList.add("warning");

    APP.streamsLength = null;
    APP.currentPage = null;
    APP.streams = null;
    APP.showingWarning = false;

    // Query all streams by default
    queryStreams();

    return function(json) {
        var streams = json.streams;

        // Reset variables/doms for each query
        APP.streams = [];
        APP.currentPage = 1;
        APP.streamsLength = streams && streams.length;

        DOM.currentPageElement.innerHTML = APP.currentPage;
        DOM.streamsLengthElement.innerHTML = APP.streamsLength;
        DOM.totalPagesElement.innerHTML = Math.max(1, Math.ceil(APP.streamsLength / 10));

        // Create stream elements
        streams.forEach(function(stream) {
            var streamElement = createStreamItemElement(stream);
            APP.streams.push(streamElement);
        });

        // Show 10 or less streams on first page
        var len = APP.streamsLength < 10 ? APP.streamsLength : 10;

        for (var idx = 0; idx < len; idx++) {
            DOM.streamsElement.appendChild(APP.streams[idx]);
        }
    }
})();

function createStreamItemElement(stream) {
    var wrapper = document.createElement("div");
    wrapper.classList.add("stream");
    wrapper.innerHTML = '<img class="stream__image"><div class="stream__info"></div>';

    var img = wrapper.children[0];
    img.setAttribute("src", stream.preview.large);

    var displayName = document.createElement("div");
    displayName.classList.add("stream__info-header");
    displayName.innerHTML = stream.channel.display_name;

    var outline = document.createElement("div");
    outline.innerHTML = stream.game + " - " + stream.viewers + " viewers";

    var description = document.createElement("div");
    description.classList.add("stream__info-description");
    description.innerHTML = stream.channel.status;

    var info = wrapper.children[1];
    info.appendChild(displayName);
    info.appendChild(outline);
    info.appendChild(description);

    return wrapper;
}

function resetStage() {
    DOM.streamsElement.innerHTML = "";

    // Used for warning box
    if (APP.timer != null) {
        clearTimeout(APP.timer);
        APP.timer = null;
        APP.showingWarning = false;
    }
}

function queryStreams() {
    resetStage();

    var game = DOM.gameInputElement.value;
    var channel = DOM.channelInputElement.value;
    var limit = DOM.limitSearchInputElement.value;

    if (game) {
        game = "&game=" + game;
    }

    if (channel) {
        channel = "&channel=" + channel;
    }

    if (limit) {
        limit = "&limit=" + limit;
    }

    var script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = "https://api.twitch.tv/kraken/streams?client_id=je7bhv6cln7ckv3dyzqkogdrgwa0rj3&callback=getStreams&limit=100" + game + channel + limit;

    DOM.streamsElement.appendChild(script);
}

// Event listeners
document.getElementById("leftArrow").addEventListener("click", function() {
    var len = (APP.currentPage - 1) * 10;
    var startIndex = len - 10;

    if (startIndex >= 0) {
        resetStage();

        APP.currentPage--;
        DOM.currentPageElement.innerHTML = APP.currentPage;

        for (var idx = startIndex; idx < len; idx++) {
            DOM.streamsElement.appendChild(APP.streams[idx]);
        }
    } else {
        if (!APP.showingWarning) {
            APP.showingWarning = true;
            DOM.warningElement.innerHTML = "Already in the first page";
            DOM.streamsElement.appendChild(DOM.warningElement);
            APP.timer = setTimeout(function() {
                DOM.streamsElement.removeChild(DOM.warningElement);
                APP.showingWarning = false;
            }, 1000);
        }
    }
});

document.getElementById("rightArrow").addEventListener("click", function() {
    var startIndex = APP.currentPage * 10;
    var len = startIndex + 10 > APP.streamsLength ? APP.streamsLength : startIndex + 10;

    if (startIndex < APP.streamsLength) {
        resetStage();

        APP.currentPage++;
        DOM.currentPageElement.innerHTML = APP.currentPage;

        for (var idx = startIndex; idx < len; idx++) {
            DOM.streamsElement.appendChild(APP.streams[idx]);
        }
    } else {
        if (!APP.showingWarning) {
            APP.showingWarning = true;
            DOM.warningElement.innerHTML = "Already in the last page";
            DOM.streamsElement.appendChild(DOM.warningElement);
            APP.timer = setTimeout(function() {
                DOM.streamsElement.removeChild(DOM.warningElement);
                APP.showingWarning = false;
            }, 1000);
        }
    }
});
