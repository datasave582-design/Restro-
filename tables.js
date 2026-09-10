/* ============================================================
   TABLES.JS — shared table-status logic for admin.html + captain.html
   Uses Firebase Realtime Database (matches database_rules.json:
   tables/{id} = { number, seats, status }).
   Requires a global `db` (firebase.database()) already initialized
   by the page that includes this script.
   ============================================================ */

let allTables = [];
let tablesRef = null;

function subscribeToTables(onChange){
  if(tablesRef) tablesRef.off();
  tablesRef = db.ref("tables");
  tablesRef.on("value", (snap) => {
    const val = snap.val() || {};
    allTables = Object.keys(val)
      .map(id => ({ id, ...val[id] }))
      .sort((a, b) => (a.number || 0) - (b.number || 0));
    onChange(allTables);
  }, (err) => {
    console.error("Failed to load tables:", err);
    onChange(allTables, err);
  });
}

function unsubscribeTables(){
  if(tablesRef) { tablesRef.off(); tablesRef = null; }
}

async function setTableStatus(id, status, extra = {}){
  try{
    await db.ref("tables/" + id).update({ status, ...extra });
  }catch(e){
    console.error("Table status update failed:", e);
    alert("Couldn't update the table. Please check your connection and try again.");
  }
}

async function addTable(number, seats){
  const num = Number(number), cap = Number(seats);
  if(!num || num <= 0) { alert("Enter a valid table number."); return; }
  if(!cap || cap <= 0) { alert("Enter a valid seat count."); return; }
  const dupe = allTables.find(t => t.number === num);
  if(dupe){ alert(`Table ${num} already exists.`); return; }
  try{
    const newRef = db.ref("tables").push();
    await newRef.set({ number: num, seats: cap, status: "free" });
  }catch(e){
    console.error("Add table failed:", e);
    alert("Couldn't add the table. Please try again.");
  }
}

async function deleteTable(id){
  try{
    await db.ref("tables/" + id).remove();
  }catch(e){
    console.error("Delete table failed:", e);
    alert("Couldn't delete the table. Please try again.");
  }
}

function tableCounts(tables){
  const c = { free: 0, occupied: 0, reserved: 0, total: tables.length };
  tables.forEach(t => { const s = t.status || "free"; c[s] = (c[s] || 0) + 1; });
  return c;
}

/* allowManage=true shows Add/Delete controls (admin only) */
function renderTableGrid(containerEl, tables, allowManage){
  if(!tables.length){
    containerEl.innerHTML = `
      <div class="empty-state">
        <h2>No tables set up yet</h2>
        <p>${allowManage ? "Add your first table using the form above." : "Ask an admin to add tables from the admin dashboard."}</p>
      </div>`;
    return;
  }
  containerEl.innerHTML = tables.map(t => {
    const status = t.status || "free";
    return `
      <div class="table-card status-${status}">
        <div class="table-card-top">
          <div class="table-num">Table ${t.number}</div>
          <span class="status-pill ${status}">${status}</span>
        </div>
        <div class="table-cap">${t.seats} seat${t.seats == 1 ? "" : "s"}</div>
        <div class="table-actions">
          ${status !== "free" ? `<button class="btn-sm btn" onclick="setTableStatus('${t.id}','free')">Mark Free</button>` : `
            <button class="btn-sm btn" onclick="setTableStatus('${t.id}','occupied')">Occupy</button>
            <button class="btn-outline-sm" onclick="setTableStatus('${t.id}','reserved')">Reserve</button>
          `}
          ${allowManage ? `<button class="btn-outline-sm danger" onclick="if(confirm('Delete Table ${t.number}? This cannot be undone.')) deleteTable('${t.id}')">Delete</button>` : ""}
        </div>
      </div>`;
  }).join("");
}
