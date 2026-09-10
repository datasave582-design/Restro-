BON AMIGOS — FINAL STABLE BUILD

IMPORTANT FIX
Staff portals now use separate Firebase Auth app namespaces:
- bonAmigosAdminPortal
- bonAmigosCaptainPortal
- bonAmigosRiderPortal
- bonAmigosCustomerPortal
This prevents logging a rider/captain in from signing the admin session out when the portals are opened in the same browser/device.

DEPLOY
1. Upload all files in this folder to the same website root.
2. Firebase Authentication: enable Email/Password.
3. Firebase Realtime Database: replace Rules with database.rules.json and Publish.
4. Open the site once in Incognito after deployment. The service worker is network-first for HTML/JS and has a new cache version.

STAFF RECORDS
Admin: Authentication account + /admins/{UID}=true OR /admins/{UID}/isAdmin=true OR /adminEmails/{UID}=true OR /staff/{UID} role=admin active=true.
Rider: Authentication account + /staff/{UID} role=rider active=true.
Captain: Authentication account + /staff/{UID} role=captain active=true.

ORDER FLOW
Customer login -> add product -> checkout -> COD/UPI/Razorpay -> order pending -> Admin assigns rider -> Rider sees only assigned orders -> accepted -> picked up -> out for delivery -> delivered.

TABLE FLOW
Customer login -> request table -> Captain/Admin confirms and assigns a suitable free table, or puts customer in waiting queue -> waiting.html TV shows queue -> customer sees live table status -> Captain/Admin frees table after dining -> customer gets thanks message and next waiting guest can be promoted.

PRODUCT IMAGE
Admin Products supports local image file selection from PC/mobile. Images are compressed in-browser before saving as product image data; no external image URL is required.

DELIVERY
Admin Settings supports delivery ON/OFF, editable fee, and free-delivery threshold.
