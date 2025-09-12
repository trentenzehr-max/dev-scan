chrome.action.onClicked.addListener(async (tab) => {
  try {
    const [injected] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async () => {
        async function getWalletFromButton() {
          const button = Array.from(document.querySelectorAll("button"))
            .find(el => el.innerText.includes("DA:"));
          if (!button) return null;

          button.click(); // trigger copy
          await new Promise(res => setTimeout(res, 100));
          return await navigator.clipboard.readText();
        }
        return await getWalletFromButton();
      }
    });

    const da = injected.result;

    if (da) {
      chrome.tabs.create({
        url: `https://solscan.io/account/${encodeURIComponent(da)}#transfers`,
        active: false
      });

      chrome.tabs.create({
        url: `https://x.com/search?q=${encodeURIComponent(da)}&f=live`,
        active: true
      });
    } else {
      console.log("⚠️ Could not capture DA.");
    }
  } catch (e) {
    console.error("Extension error:", e);
  }
});

// Listen for injected click handler
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("📩 Background received message:", msg);

  if (msg.action === "openTabs" && msg.da) {
    const da = msg.da;

    chrome.tabs.create({
      url: `https://solscan.io/account/${encodeURIComponent(da)}#transfers`,
      active: false
    });

    chrome.tabs.create({
      url: `https://x.com/search?q=${encodeURIComponent(da)}&f=live`,
      active: true
    });

    console.log("✅ Tabs opened for:", da);
  }
});
