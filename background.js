chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if(activeTab.url && activeTab.url.includes("sensortower")) {
        const isPlayableLink = (details.url.includes("https://x-ad-assets.s3.amazonaws.com/media_asset/") || details.url.includes("appmagic.rocks")) && details.url.includes("/index.html");
        const link = details.url;
        if (isPlayableLink) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "showLink", data: link });
            }
          });
        }
      }
    });
  },
  { urls: ["<all_urls>"] }, 
  ["requestBody"]
);