# Table Reservations + Live Table Status — Firebase Setup (Phase 3, Realtime Database)

Three files work together, all in the same folder:
- **index.html** — public "Book a Table" form (guests can submit without logging in)
- **admin.html** — full control for the owner/manager: confirm/cancel reservations, add/remove tables, change any table's status
- **captain.html** — lighter app for staff on shift: live counts (tables free/occupied/reserved, bookings pending/confirmed today), mark tables free/occupied/reserved, confirm/cancel reservations. Captains **cannot** add or delete tables.

Two shared scripts power both dashboards — keep them in the same folder as the HTML files:
- `tables.js` — table status logic
- `reservations.js` — reservation list logic

This version uses **Firebase Realtime Database** (not Firestore), matching `database_rules.json`.

## 1. Firebase project config
Your project's config is already filled into `FIREBASE_CONFIG` in **all three** HTML files. One thing to double-check yourself:

`databaseURL` — go to Firebase Console → **Realtime Database**, and copy the exact URL shown at the top of that page (it depends on which region you picked when you created the database, e.g. `https://restro-56bc7-default-rtdb.asia-southeast1.firebasedatabase.app` or `...firebaseio.com`). The value currently in the files is a best guess — paste the real one from your console into all three files if it differs.

## 2. Turn on Realtime Database
Firebase Console → **Realtime Database** → **Create Database** → pick a region close to your users → start in **locked mode** (the rules below replace the default).

## 3. Publish the security rules
Realtime Database → **Rules** tab → paste the full contents of `database_rules.json` → **Publish**.

This schema has two separate staff concepts:
- **`admins/{uid}`** — full control (reservations, tables, products, settings). Value is either `true` or `{ isAdmin: true }`.
- **`staff/{uid}`** — captains and delivery riders. Value is `{ role: "captain" | "rider", active: true|false }`.

## 4. Turn on login + create accounts
1. Authentication → Sign-in method → enable **Email/Password**.
2. Authentication → Users → **Add user** for every person who needs `admin.html` or `captain.html` access. Note the **User UID** shown after creating each one.
3. Realtime Database → **Data** tab → grant access:
   - **For an admin:** under `admins`, add a child node with the person's **UID** as the key, and value `true`.
   - **For a captain:** under `staff`, add a child node keyed by their **UID**, with two fields: `role` = `"captain"`, `active` = `true` (boolean, not text).

   Without one of these entries, sign-in succeeds but the app immediately signs them back out with an "isn't set up for access" message — that's the access check working, not a bug. To temporarily suspend a captain without deleting their account, just flip `active` to `false`.

## 5. Add your tables
1. Open `admin.html`, sign in with an **admin** account.
2. Go to the **Tables** tab → "Add Table" form → enter table number + seat count. New tables start as **Free**.
3. Tables are shared live data — anything an admin or captain changes updates instantly on every signed-in device.

## 6. Test it end to end
1. Open `index.html` (no login needed), click "Book a Table", submit a test booking.
2. Open `admin.html` or `captain.html`, sign in — the test booking appears under **Pending** in the Reservations tab, and can be confirmed/cancelled from either app.
3. In the Tables view, mark a table Occupied or Reserved, then Free — status updates live, no refresh needed, same on both apps.

## 7. Install as an app (PWA)
`index.html`, `admin.html`, and `captain.html` are each installable on a phone or desktop, like a native app:
- **Android (Chrome):** open the page → menu (⋮) → **Add to Home screen** / **Install app**.
- **iPhone (Safari):** open the page → Share icon → **Add to Home Screen**.
- **Desktop (Chrome/Edge):** open the page → install icon in the address bar, or menu → **Install [app name]**.

Install `captain.html` on the captain's phone so it opens full-screen with no browser bar. All three pages register the shared `sw.js` service worker, which caches the app shell so the page opens instantly and shows a fallback if the connection briefly drops; live reservation and table data still needs an internet connection.

## Notes
- `RESERVE_CONFIG` at the top of `index.html`'s script controls open/close hours, slot length, and max party size.
- Every booking also offers a "Confirm on WhatsApp" button so the guest gets an instant message even before staff act on it.
- `admin.html` and `captain.html` both have `<meta name="robots" content="noindex, nofollow">` so they won't get indexed, but the real protection is the rules in `database_rules.json` plus each account's `admins`/`staff` entry — not the URL being unlisted.
- Table statuses are **free**, **occupied**, and **reserved**. Only admins can add/delete a table; both admins and captains can change any table's status.
- The rules file also defines `products`, `orders`, `riderLocations`, `orderHistory`, and `customerLocations` — these are ready for a future online-ordering + delivery-rider feature, but there's no UI for them yet in these three files.
