BON AMIGOS - FINAL RESTAURANT CONTROL SYSTEM
=============================================

FILES
-----
index.html      Customer website
admin.html      Admin dashboard
captain.html    Captain dashboard
rider.html      Rider dashboard
firestore.rules Firestore security rules
storage.rules   Storage security rules
manifest.webmanifest / sw.js / icons  PWA support

FIREBASE ONE-TIME SETUP
-----------------------
1. Firebase Console -> Authentication -> Sign-in method -> Email/Password -> Enable.
2. Create Firestore Database.
3. Firebase Authentication -> Users -> Add user. This is your first Admin login.
4. Copy that user's UID.
5. Firestore -> Data -> Start collection -> Collection ID: admins
6. Document ID = the Admin user's UID.
7. Add field: isAdmin | boolean | true
8. Firestore -> Rules: paste firestore.rules and Publish.
9. Storage -> Rules: paste storage.rules and Publish.
10. Upload all website files to Hostinger public_html.

LOGIN PAGES
-----------
Admin: /admin.html
Captain: /captain.html
Rider: /rider.html
Customer: /

IMPORTANT
---------
- The Firebase web API key in the HTML is a client identifier, not a server password.
- Never put a Firebase service-account/private key in these public files.
- GPS requires HTTPS on the live domain and the customer/rider must allow location permission.
- The customer order form currently uses browser GPS and reverse geocoding to show a readable GPS address.
- Admin creates Captain/Rider accounts from the dashboard.
- Admin assigns delivery orders to Riders.
- Rider sees only orders assigned to that Rider.
- Rider can accept, pick up, mark out for delivery, and mark delivered.
- Rider dashboard can publish its live GPS location while the page is open and location permission is granted.

FIRST USE AFTER LOGIN
---------------------
Admin -> add restaurant tables.
Admin -> create Captain accounts.
Admin -> create Rider accounts.
Admin -> add products/menu items and images.
Admin -> save restaurant settings.

CUSTOMER ORDER FLOW
-------------------
Add items -> Order Online -> name/mobile -> Use My GPS -> address/payment method -> Place Order.
Order is saved in Firestore collection: orders with status pending.

TABLE FLOW
----------
Customer -> reservation pending -> Admin/Captain confirm -> assign table -> seated.
Captain can also create a walk-in/seated booking.

DELIVERY FLOW
--------------
pending -> confirmed -> assigned -> accepted -> picked_up -> out_for_delivery -> delivered
Admin can cancel an order.

PWA
---
The site includes a manifest and service worker. Serve over HTTPS for install/location features.
