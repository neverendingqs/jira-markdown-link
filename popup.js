const getPageInfo = () => {
  return { title: document.title, url: document.URL };
};

const formatTitle = (text, url, format) => {
  const title = text.replace(/ \- Jira$/i, '');
  const [, id, description] = title.match(/^\[(.*?)\]\W(.*)$/) || [];

  if (format === 'fullLink') {
    return `[[${id}]: ${description}](${url})`;
  }

  return `*[${id}](${url}): ${description}*`;
};

const copyWithFormat = async (format) => {
  const status = document.getElementById('status');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getPageInfo
    });

    const formatted = formatTitle(result.title, result.url, format);
    await navigator.clipboard.writeText(formatted);

    status.textContent = 'Copied!';
    setTimeout(() => window.close(), 500);
  } catch (err) {
    console.error(err);
    status.textContent = 'Failed to copy.';
  }
};

document.getElementById('idLink').addEventListener('click', () => copyWithFormat('idLink'));
document.getElementById('fullLink').addEventListener('click', () => copyWithFormat('fullLink'));
