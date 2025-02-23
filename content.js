document.addEventListener("click", tryShowLink);

async function tryShowLink() {
  let link = await findLink();
  const playableOpened = document.getElementsByClassName("playable-ad-modal").length > 0 || document.getElementsByClassName("img-gallery-dialog-backdrop").length > 0;
  if(link !== null && playableOpened) {
    showShareModal(link);
  }
}

let lastPromise = null;

async function findLink() {
  const currentPromise = new Promise((resolve) => {
    setTimeout(() => {
      if (currentPromise !== lastPromise) return; // Отмена выполнения старых вызовов
      let entries = performance.getEntriesByType("resource");
      let filtered = entries.filter(e => 
        (e.name.includes("x-ad") || e.name.includes("appmagic.rocks")) && e.name.includes("index.html")
      );
      resolve(filtered.length > 0 ? filtered[filtered.length - 1].name : null);
    }, 3000);
  });

  lastPromise = currentPromise;
  return currentPromise;
}

function showShareModal(link) {
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

  document.addEventListener("click", function(event) {
      if (!modal.contains(event.target) && event.target.id !== "shareButton") {
          modal.remove();
      }
  }, { once: true });

  document.body.appendChild(modal);
}
