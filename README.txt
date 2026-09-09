BON AMIGOS — REALTIME DATABASE ONLY
===================================

Backend:
- Firebase Realtime Database = ALL application data
- Firebase Authentication = Admin/Captain/Rider login only
- Firebase Firestore = NOT USED
- Firebase Storage = NOT USED
- Product/logo/gallery images use public HTTPS image URLs

Firebase setup
--------------
1) Open Firebase Console -> project restro-56bc7.
2) Authentication -> Sign-in method -> Email/Password -> Enable.
3) Build -> Realtime Database -> Create Database.
4) Realtime Database -> Rules -> replace rules with database.rules.json -> Publish.
5) Create the first Admin in Authentication -> Users -> Add user.
6) Copy Admin UID.
7) Realtime Database -> Data -> create:
   admins
     ADMIN_UID
       isAdmin: true   (Boolean, not text)

Hosting
-------
Upload ALL files to Hostinger public_html.
Customer: /
Admin: /admin.html
Captain: /captain.html
Rider: /rider.html
Use HTTPS for GPS.

Admin
-----
- Tables: add/change free, reserved, occupied, cleaning, blocked.
- Bookings: confirm, cancel, assign table.
- Products: add price/category/description/image URL and optional product-specific UPI ID.
- Captains/Riders: create and enable/disable accounts.
- Orders: see customer address/GPS, customer live-location updates, payment status, and select an ONLINE rider to send the order.
- Settings: business details, default UPI, COD on/off, optional Razorpay Key ID.

Customer order + location
-------------------------
- Customer selects items and taps Use My GPS.
- Order stores latitude/longitude in Realtime Database.
- After order, Share Live Location can continue updating customerLocations/orderId while the page remains open.
- Admin gets Customer Map and can send the order to an online rider.
- Rider is considered online while rider GPS was updated within the last 90 seconds.

Payments
--------
COD:
- Admin can enable/disable COD.
- If COD is disabled, it is not shown to customers.

UPI:
- Admin -> Settings -> Default UPI ID.
- Product can have its own UPI ID. If the cart contains one product-UPI, that UPI is used; mixed UPI carts fall back to the restaurant default UPI.
- Customer selects UPI; COD is not selected at the same time.
- Customer can open a UPI app and optionally enter UTR/reference.
- Admin manually confirms payment in Orders.

Razorpay (optional):
- Admin enables Razorpay and enters Key ID.
- Customer sees Razorpay only when enabled and a key is configured.
- Checkout opens from the browser and payment submission is stored in Realtime Database.
- IMPORTANT: production Razorpay payment signature verification normally requires a secure server endpoint. This package intentionally has no server/backend other than Firebase Realtime Database, so Admin confirmation is still required.

Important
---------
- Do NOT create/use Firestore for this package.
- Do NOT create/use Firebase Storage for this package.
- Public image URLs must be direct HTTPS image URLs.
- GPS works only after browser permission and normally requires HTTPS.
