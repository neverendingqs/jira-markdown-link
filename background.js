const injectedFunction = (format) => {
  const formatTitle = (text, url, format) => {
    const title = text.replace(/ \- Jira$/i, '');
    const [, id, description] = title.match(/^\[(.*?)\]\W(.*)$/) || [];

    if (format === 'fullLink') {
      return `[[${id}]: ${description}](${url})`;
    }

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

  const formatted = formatTitle(document.title, document.URL, format);

  if (!navigator.clipboard) {
    copyTextToClipboard(formatted);
  } else {
    navigator.clipboard.writeText(formatted).catch((err) => {
      console.error(err);
    });
  }
};

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get({ format: 'idLink' }, (options) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectedFunction,
      args: [options.format]
    });
  });
});
