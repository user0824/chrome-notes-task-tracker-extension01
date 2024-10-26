// * This linkes the side panel to the action icon
await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
/*async function getCurrentTabUrl() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);

  return tab ? tab.url : undefined;
}

getCurrentTabUrl().then((tab) => {
  console.log(tab);
});
*/
chrome.tabs.onActivated.addListener((activeTab) => {
  console.log(activeTab);
});
