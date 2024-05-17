const injectedFunction = () => {
  const formatTitle = (text, url) => {
    const title = text.replace(/ \- Jira$/i, '');
    const [, id, description] = title.match(/^\[(.*?)\]\W(.*)$/) || [];

    return `[${id}](${url}): ${description}`;
  };

  const copyTextToClipboard = (text) => {
    var copyFrom = document.createElement('textarea');
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
  };

  const formatted = formatTitle(document.title, document.URL);

  if (!navigator.clipboard) {
    copyTextToClipboard(formatted);
  } else {
    navigator.clipboard.writeText(formatted).catch((err) => {
      console.error(err);
    });
  }
};

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectedFunction
  });
});
