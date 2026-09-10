/* ============================================================
   RESERVATIONS.JS — shared reservation-list logic for admin.html + captain.html
   Uses Firebase Realtime Database (matches database_rules.json:
   reservations/{id} = { name, phone, date, time, guests, notes, status, createdAt }).
   Requires a global `db` (firebase.database()) and `BUSINESS_NAME`
   already defined by the page that includes this script.
   ============================================================ */

let allReservations = [];
let reservationsRef = null;

function subscribeToReservations(onChange){
  if(reservationsRef) reservationsRef.off();
  reservationsRef = db.ref("reservations").orderByChild("createdAt");
  reservationsRef.on("value", (snap) => {
    const val = snap.val() || {};
    allReservations = Object.keys(val)
      .map(id => ({ id, ...val[id] }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    onChange(allReservations);
  }, (err) => {
    console.error("Failed to load reservations:", err);
    onChange(allReservations, err);
  });
}

function unsubscribeReservations(){
  if(reservationsRef) { reservationsRef.off(); reservationsRef = null; }
}

async function updateReservationStatus(id, status){
  try{
    await db.ref("reservations/" + id).update({ status });
  }catch(e){
    console.error("Status update failed:", e);
    alert("Couldn't update status. Please try again.");
  }
}

function filterReservations(list, filter, search){
  let out = list;
  if(filter !== "all") out = out.filter(r => (r.status || "pending") === filter);
  if(search){
    const s = search.trim().toLowerCase();
    out = out.filter(r =>
      (r.name || "").toLowerCase().includes(s) ||
      (r.phone || "").includes(s)
    );
  }
  return out;
}

function reservationCounts(list){
  const c = { pending: 0, confirmed: 0, cancelled: 0, total: list.length };
  list.forEach(r => { const s = r.status || "pending"; c[s] = (c[s] || 0) + 1; });
  return c;
}

function todaysReservations(list){
  const today = new Date().toISOString().split("T")[0];
  return list.filter(r => r.date === today);
}

function renderReservationGrid(gridEl, emptyEl, list){
  if(!list.length){
    gridEl.style.display = "none";
    emptyEl.style.display = "";
    return;
  }
  emptyEl.style.display = "none";
  gridEl.style.display = "grid";

  gridEl.innerHTML = list.map(r => {
    const dateLabel = r.date ? new Date(r.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
    let timeLabel = r.time || "—";
    if(r.time){
      const [h, m] = r.time.split(":");
      timeLabel = new Date(2000, 0, 1, h, m).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
    }
    const status = r.status || "pending";
    const waHref = `https://wa.me/91${r.phone}?text=${encodeURIComponent(`Hello ${r.name}, this is ${BUSINESS_NAME} confirming your table for ${dateLabel} at ${timeLabel}.`)}`;

    return `
      <div class="res-card">
        <div>
          <div class="res-name">${escapeHtml(r.name || "—")}</div>
          <div class="res-sub">${escapeHtml(r.phone || "—")}</div>
        </div>
        <div class="res-meta"><span class="lbl">Date &amp; Time</span>${dateLabel} · ${timeLabel}</div>
        <div class="res-meta"><span class="lbl">Guests</span>${r.guests || "—"}</div>
        <div>
          <span class="status-pill ${status}">${status}</span>
          ${r.notes ? `<div class="res-notes">"${escapeHtml(r.notes)}"</div>` : ""}
        </div>
        <div class="res-actions">
          ${status !== "confirmed" ? `<button class="btn-sm btn" onclick="updateReservationStatus('${r.id}','confirmed')">Confirm</button>` : ""}
          ${status !== "cancelled" ? `<button class="btn-outline-sm" onclick="updateReservationStatus('${r.id}','cancelled')">Cancel</button>` : ""}
          <a class="btn-outline-sm" href="${waHref}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;">WhatsApp</a>
        </div>
      </div>`;
  }).join("");
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
