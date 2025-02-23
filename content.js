const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
          mutation.addedNodes.forEach(node => {
              if (node.tagName === "IFRAME" && node.src) {
                  console.log("New iframe detected:", node.src);
              }
              // Проверяем, есть ли <iframe> внутри добавленного элемента
              node.querySelectorAll?.("iframe[src]").forEach(iframe => {
                console.log("New iframe detected:", iframe.src);
                  showShareModal(iframe.src);
              });
          });
      }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

function showShareModal(link) {
  console.log('debug: ' + link);

  const oldModal = document.getElementById("shareModal");
  if (oldModal) {
    oldModal.remove();
  }

  const modal = document.createElement("div");
  modal.id = "shareModal";
  modal.style.position = "fixed";
  modal.style.bottom = "70px";
  modal.style.right = "20px";
  modal.style.padding = "15px";
  modal.style.backgroundColor = "white";
  modal.style.border = "1px solid #ccc";
  modal.style.borderRadius = "5px";
  modal.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.gap = "10px";
  modal.style.zIndex = "100000";

  const input = document.createElement("input");
  input.type = "text";
  input.value = link;
  input.readOnly = true;
  input.style.flex = "1";
  input.style.padding = "5px";
  input.style.border = "1px solid #ccc";
  input.style.borderRadius = "3px";

  const copyButton = document.createElement("button");
  copyButton.innerText = "🔗";
  copyButton.style.cursor = "pointer";
  copyButton.style.border = "none";
  copyButton.style.background = "transparent";
  copyButton.style.fontSize = "18px";
  copyButton.title = "Copy";
  let timeoutId;
  copyButton.onclick = function() {
      navigator.clipboard.writeText(link);
      copyButton.innerText = "✅";
      copyButton.title = "Copied";
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        copyButton.innerText = "🔗";
        copyButton.title = "Copy";
      }, 2000);
  };

  const closeButton = document.createElement("button");
  closeButton.innerText = "❌";
  closeButton.style.cursor = "pointer";
  closeButton.style.border = "none";
  closeButton.style.background = "transparent";
  closeButton.style.fontSize = "18px";
  closeButton.style.color = "red";
  closeButton.title = "Close";
  closeButton.onclick = function() {
    modal.remove();
  };

  modal.appendChild(input);
  modal.appendChild(copyButton);
  modal.appendChild(closeButton);

  setTimeout(() => {
    document.addEventListener("click", outsideClickListener);
  }, 0);

  function outsideClickListener(event) {
    if (!modal.contains(event.target) && event.target.id !== "shareButton") {
      modal.remove();
      document.removeEventListener("click", outsideClickListener);
    }
  }

  document.body.appendChild(modal);
}
