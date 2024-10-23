document.getElementById("applyCode").addEventListener("click", () => {
  const cssCode = document.getElementById("cssCode").value;

  // Сохраняем CSS и JS в chrome.storage
  chrome.storage.local.set({ userCss: cssCode }, () => {
    console.log("CSS код сохранен");
  });

  // Применяем CSS на текущей вкладке
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Применяем CSS
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: applyCSS,
      args: [cssCode],
    });
  });
});

function applyCSS(cssCode) {
  const styleElement = document.createElement("style");
  styleElement.textContent = cssCode;
  document.head.appendChild(styleElement);
}

document.getElementById("outlineBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: outlineFunc,
    });
  });
});

function outlineFunc() {
  let getstl = document.getElementById("stl");
  if (getstl) {
    getstl.remove();
  } else {
    const stl = document.createElement("style");
    stl.setAttribute("id", "stl");
    stl.textContent = "*:hover {outline: 1px solid red}";
    document.head.appendChild(stl);
    window.addEventListener("click", function saveElements(e){
        el = e.target;
        let t = document.querySelector('.element');
        console.log(t)
        e.preventDefault();
        this.removeEventListener("click", saveElements);
    });
  }
}
