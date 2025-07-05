chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    const pageUrl = currentTab.url;

    //console.warn("User's active tab URL:", pageUrl);
    const catElements = document.querySelectorAll(".cat");
    const last = parseInt(localStorage.getItem("lastCatIndex") ?? 0);

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * catElements.length);
    } while (randomIndex === last);

    // Store current index for next load
    localStorage.setItem("lastCatIndex", randomIndex);

    // Show the selected cat
    if (pageUrl.startsWith("https://www.google.com/maps")) {
        document.getElementsByClassName("content")[0].textContent = "Click on a location to explore it on community platforms."
    } else {
        catElements[randomIndex].style.display = "block";
    }
    //console.warn("last index: ", last, " current index: ", randomIndex);
});