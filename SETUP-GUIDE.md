# Bon Amigos — Full Site Setup Guide

## What's in this package
| File | What it's for |
|---|---|
| `index.html` | Public homepage — hero, reviews, favourites, table reservation modal |
| `menu.html` | Full menu — search/filter, cart, checkout (COD or UPI) |
| `admin.html` | Staff dashboard — Orders, Reservations, Settings (private, not linked in nav) |
| `rider.html` | Delivery rider dashboard — pick up & deliver orders (private, not linked in nav) |

All four pages share **one Firebase project**. Edit business info in ONE place —
`admin.html` → Settings tab — and it flows live into `index.html` and `menu.html`.
(`FIREBASE_CONFIG` itself, and things like page titles, still live in each file's
code — see step 6.)

> ⚠️ **If you're reusing an existing Firebase project:** this site needs
> **Firestore Database** (not Realtime Database). In Firebase Console, go to
> Build → Firestore Database. If it says "Create database", click it and
> follow step 2 below — a `databaseURL` in your config just means Realtime
> Database exists too, it doesn't mean Firestore is set up.

---

## 1. Create a Firebase project
[console.firebase.google.com](https://console.firebase.google.com) → Add project (free "Spark" plan is enough to start).

## 2. Turn on Firestore
Firestore Database → Create database → **production mode** → pick a region close to your customers (e.g. `asia-south1` for India).

## 3. Turn on staff/rider login
Authentication → Sign-in method → enable **Email/Password**.
Authentication → Users → **Add user** for:
- Yourself / each staff member who needs `admin.html`
- Each rider who needs `rider.html`

Everyone uses the *same* login system — there's no separate "rider" account type, so anyone with a login can technically open `admin.html` too. For a small team this is usually fine; just don't hand out logins loosely.

## 4. Firestore security rules
Firestore Database → Rules → replace everything with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /reservations/{id} {
      allow create: if request.resource.data.name is string
                    && request.resource.data.phone is string
                    && request.resource.data.date is string
                    && request.resource.data.time is string
                    && request.resource.data.status == "pending";
      allow read, update: if request.auth != null;
      allow delete: if false;
    }

    match /orders/{id} {
      allow create: if request.resource.data.name is string
                    && request.resource.data.phone is string
                    && request.resource.data.address is string
                    && request.resource.data.items is list
                    && request.resource.data.orderStatus == "pending";
      allow read, update: if request.auth != null;
      allow delete: if false;
    }

    match /settings/{id} {
      allow read: if true;                    // public pages need this
      allow write: if request.auth != null;    // only signed-in staff can edit
    }
  }
}
```

Publish the rules.

> **Note on roles:** these rules treat every signed-in account the same (any
> logged-in user can update orders/reservations/settings). Splitting "admin"
> vs "rider" permissions properly needs Firebase custom claims, which requires
> a small Cloud Function (Blaze/pay-as-you-go plan) — out of scope for this
> static-site setup, but worth doing later if you have many riders.

## 5. Fill in FIREBASE_CONFIG (4 places)
Firebase Console → ⚙️ Project Settings → General → "Your apps" → copy the config object.
Paste the **same values** into `FIREBASE_CONFIG` near the top of the `<script>` tag in:
- `index.html`
- `menu.html`
- `admin.html`
- `rider.html`

## 6. Fill in the rest of CONFIG
Each public page (`index.html`, `menu.html`) has its own `CONFIG` object at the
top with placeholders marked `// REPLACE` — phone, WhatsApp number, address,
Maps link. Fill these in as a fallback; once you save real values in
`admin.html` → Settings, those override the fallback automatically on both pages.

## 7. Set up UPI payments
In `admin.html` → **Settings** tab (after signing in):
1. **UPI ID** — your `name@upi` handle.
2. **UPI QR Image URL** — optional. Host your QR code image anywhere public
   (Google Drive "anyone with link", Imgur, your own site) and paste the direct
   image URL. If left blank, checkout just shows the UPI ID for customers to
   pay manually.

Orders paid via UPI land in `admin.html` → Orders as **"pending verification"**.
Once you've checked the payment actually arrived, click **Mark Paid**.

## 8. Set the offer/announcement caption
Same Settings tab → **Banner Caption**. Shows as a gold strip at the top of
both `index.html` and `menu.html`. Leave blank to hide it.

## 9. Menu & dish data
Edit the `MENU_ITEMS` array directly in `menu.html` (and `DISHES` in
`index.html` for the homepage highlights) with real names, prices, and
categories.

## 10. Test the full flow
1. Open `menu.html` → add a few items to cart → checkout with a test name/phone/address, try both COD and UPI.
2. Open `admin.html` → sign in → **Orders** tab: the test order should appear as "pending". Click **Confirm**.
3. Open `rider.html` → sign in with a rider login → **Available** tab: the confirmed order shows up. Click **Pick Up** → it moves to **My Deliveries**.
4. Click **Mark Delivered** → back in `admin.html`, the order status updates to "delivered" live.
5. Open `index.html` → click "Book a Table" → submit a reservation → check it shows up under `admin.html` → **Reservations**.

## Notes & limits
- No real payment gateway is wired up (that needs a business account + API
  keys with a provider like Razorpay/PhonePe, plus backend code). UPI here is
  "pay manually, admin verifies" — described accurately, not a live payment API.
- GPS location is captured only if the customer allows their browser's location
  permission; the address text field is always required as a fallback.
- `admin.html` and `rider.html` are not linked from any public menu — they're
  only reachable if someone has the direct URL, plus they require a valid
  login. Bookmark them for your team.
- Hosting: any static host works (Firebase Hosting, Netlify, Vercel, or your
  existing web host) since these are plain HTML/CSS/JS files talking to Firebase.
