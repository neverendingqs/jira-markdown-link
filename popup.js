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
    const copyFrom = document.createElement('textarea');
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

const copyWithFormat = (format) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: injectedFunction,
      args: [format]
    });

    const status = document.getElementById('status');
    status.textContent = 'Copied!';
    setTimeout(() => window.close(), 500);
  });
};

document.getElementById('idLink').addEventListener('click', () => copyWithFormat('idLink'));
document.getElementById('fullLink').addEventListener('click', () => copyWithFormat('fullLink'));
