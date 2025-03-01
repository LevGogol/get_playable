const observer = new MutationObserver(handleMutations);
observer.observe(document.body, { childList: true, subtree: true });

function handleMutations(mutationsList) {
  mutationsList.forEach(({ type, addedNodes }) => {
    if (type !== "childList") {
      return;
    }
    addedNodes.forEach((node) => {
      node
        .querySelectorAll?.("iframe[src]")
        .forEach((iframe) => showShareModal(iframe.src));
    });
  });
}

function showShareModal(link) {
  document.getElementById("shareModal")?.remove();

  const modal = createModal(link);
  document.body.appendChild(modal);

  setTimeout(
    () =>
      document.addEventListener("click", (e) => outsideClickListener(e, modal)),
    0
  );
}

function createModal(link) {
  const modal = Object.assign(document.createElement("div"), {
    id: "shareModal",
    style: `
      position: fixed; bottom: 70px; right: 20px; padding: 15px;
      background: white; border: 1px solid #ccc; border-radius: 5px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); display: flex;
      align-items: center; gap: 10px; z-index: 100000;
    `,
  });

  const input = Object.assign(document.createElement("input"), {
    type: "text",
    value: link,
    readOnly: true,
    style: "flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px;",
  });

  const copyButton = createButton("🔗", "Copy", () =>
    copyToClipboard(copyButton, link)
  );
  const closeButton = createButton("❌", "Close", () => modal.remove());

  modal.append(input, copyButton, closeButton);
  return modal;
}

function createButton(text, title, onClick) {
  return Object.assign(document.createElement("button"), {
    innerText: text,
    title,
    onclick: onClick,
    style: `cursor: pointer; border: none; background: transparent; font-size: 18px;`,
  });
}

function copyToClipboard(button, text) {
  navigator.clipboard.writeText(text);
  button.innerText = "✅";
  button.title = "Copied";
  setTimeout(
    () => Object.assign(button, { innerText: "🔗", title: "Copy" }),
    2000
  );
}

function outsideClickListener(event, modal) {
  if (!modal.contains(event.target)) {
    modal.remove();
    document.removeEventListener("click", (e) =>
      outsideClickListener(e, modal)
    );
  }
}
