chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    //console.log("Tab URL changed to:", changeInfo.url, " from: ", tab.url, " change is: ", changeInfo.status);
	if (tab.url?.startsWith("https://www.google.com/maps/place/")) {
		//console.warn("sending message...");
		chrome.tabs.sendMessage(tabId, { action: "add-ui-element" });
	}
  }
});
