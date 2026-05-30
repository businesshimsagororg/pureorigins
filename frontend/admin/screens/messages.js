import { req, withToast } from "../api.js";
import { state } from "../state.js";
import { escapeHtml, dateText, statusPill, $ } from "../utils.js";
import { emptyState, skeletonTable } from "../ui/table.js";
import { toast } from "../ui/toast.js";

export function renderMessages() {
  const el = $("#messagesTable");
  if (!el) return;
  if (!state.messages.length) {
    el.innerHTML = emptyState("No messages yet.");
    return;
  }
  el.innerHTML = state.messages
    .map(
      message => `
    <article class="message-card" data-message-id="${message._id}">
      <header class="message-card-head">
        <div>
          <strong>${escapeHtml(message.name)}</strong>
          <small>${escapeHtml(message.phone || message.email || "-")} · ${dateText(message.createdAt)}</small>
        </div>
        ${statusPill(message.status || "new", message.status !== "archived")}
      </header>
      <h3>${escapeHtml(message.subject)}</h3>
      <p class="message-body">${escapeHtml(message.message)}</p>
      <div class="actions">
        <button type="button" class="mini-btn" data-message-status="${message._id}" data-status="read">Mark read</button>
        <button type="button" class="mini-btn" data-message-status="${message._id}" data-status="replied">Replied</button>
        <button type="button" class="mini-btn danger" data-message-status="${message._id}" data-status="archived">Archive</button>
      </div>
    </article>`
    )
    .join("");
}

export async function loadMessages() {
  const { messages } = await req("/contact/admin/messages");
  state.messages = messages;
  renderMessages();
}

export function mountMessagesScreen(root) {
  root.innerHTML = `
    <div class="screen-toolbar">
      <button type="button" class="ghost-btn" data-refresh-messages>Refresh</button>
    </div>
    <div class="panel messages-panel"><div id="messagesTable"></div></div>
  `;
  root.querySelector("[data-refresh-messages]")?.addEventListener("click", () => loadMessages().catch(e => toast.error(e.message)));
  root.querySelector("#messagesTable")?.addEventListener("click", async e => {
    const btn = e.target.closest("[data-message-status]");
    if (!btn) return;
    await withToast(
      req(`/contact/admin/messages/${btn.dataset.messageStatus}`, { method: "PUT", body: { status: btn.dataset.status } }),
      "Message updated."
    );
    await loadMessages();
  });
  if (!state.messages.length) {
    root.querySelector("#messagesTable").innerHTML = skeletonTable();
    loadMessages().catch(e => toast.error(e.message));
  } else renderMessages();
}
