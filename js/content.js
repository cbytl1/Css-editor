// Применяем CSS
chrome.storage.local.get('userCss', (data) => {
    if (data.userCss) {
      const styleElement = document.createElement('style');
      styleElement.textContent = data.userCss;
      document.head.appendChild(styleElement);
    }
  });
  