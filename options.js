const radios = document.querySelectorAll('input[name="format"]');
const status = document.getElementById('status');

chrome.storage.sync.get({ format: 'idLink' }, (options) => {
  document.querySelector(`input[value="${options.format}"]`).checked = true;
});

radios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    chrome.storage.sync.set({ format: e.target.value }, () => {
      status.textContent = 'Saved!';
      setTimeout(() => { status.textContent = ''; }, 1000);
    });
  });
});
