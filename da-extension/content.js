console.log("🚀 DA Quick Lookup content script loaded");

function attachClickToDA() {
  // Grab the DA button by its class
  const daButton = document.querySelector(
    "button.flex.flex-row.gap-\\[4px\\].flex-1.items-center.cursor-pointer.h-\\[32px\\].px-\\[8px\\]"
  );

  if (!daButton || daButton.dataset.daClickBound) return;

  daButton.dataset.daClickBound = "true"; // mark so we don’t bind twice

  daButton.addEventListener("click", async (e) => {
    // Only left click
    if (e.button !== 0) return;

    console.log("✅ DA button clicked");

    // Wait briefly so Axiom copies the wallet to clipboard
    await new Promise((res) => setTimeout(res, 100));

    const wallet = await navigator.clipboard.readText();
    console.log("📋 Copied wallet:", wallet);

    chrome.runtime.sendMessage({ action: "openTabs", da: wallet });
  });

  console.log("✅ Bound click handler to DA button");
}

// Keep retrying in case React re-renders
setInterval(attachClickToDA, 2000);
