BON AMIGOS — REALTIME DATABASE EDITION
======================================

This version uses:
- Firebase Authentication (Email/Password)
- Firebase Realtime Database for ALL application data
- NO Cloud Firestore
- NO Firebase Storage
- Product/restaurant images are stored as public image URLs

FILES
-----
index.html       Customer website, reservations + online ordering + GPS
admin.html       Admin dashboard
captain.html     Captain dashboard
rider.html       Delivery rider dashboard
database.rules.json  Realtime Database security rules
manifest.webmanifest / sw.js / icons  PWA files

FIREBASE SETUP
--------------
1. Firebase Console -> Build -> Realtime Database -> Create Database.
2. Copy the Database URL shown by Firebase.
3. If your URL is different from the one in the HTML files, replace:
   https://restro-56bc7-default-rtdb.firebaseio.com
   in index.html, admin.html, captain.html and rider.html.
4. Build -> Authentication -> Sign-in method -> enable Email/Password.
5. Authentication -> Users -> Add user. This is your first Admin login.
6. Copy that user's UID.
7. Realtime Database -> Data -> create top-level node:
   admins
   Under admins create a child named exactly the Admin UID.
   Add:
      isAdmin: true
8. Realtime Database -> Rules -> replace the rules with database.rules.json -> Publish.
9. Upload the whole folder to Hostinger public_html.

IMPORTANT: DO NOT CREATE FIRESTORE OR FIREBASE STORAGE FOR THIS VERSION.

ADMIN
-----
/admin.html
- Table control: free/reserved/occupied/cleaning/blocked
- Booking control and table assignment
- Product/menu management with image URL
- Captain account creation and enable/disable
- Rider account creation and enable/disable
- Online order confirmation/cancellation
- Rider assignment
- Restaurant settings and logo URL

CAPTAIN
-------
/captain.html
- Separate login
- Live table floor
- Confirm/seated/cancel bookings
- Assign free table
- Walk-in booking
- Free/occupied/cleaning/blocked table actions

RIDER
-----
/rider.html
- Separate login
- Only assigned orders
- Customer phone/address/GPS
- Google Maps navigation
- Status: assigned -> accepted -> picked_up -> out_for_delivery -> delivered
- Live rider GPS while dashboard is open and location permission is allowed

CUSTOMER ORDER
--------------
- Add menu items to cart
- Name + mobile
- Delivery address
- Use My GPS
- COD/online payment selection field
- Order saved in Realtime Database under /orders
- Admin assigns rider

DATABASE STRUCTURE
------------------
/admins/{uid}
/staff/{uid}
/tables/{tableId}
/reservations/{reservationId}
/products/{productId}
/orders/{orderId}
/riderLocations/{riderUid}
/orderHistory/{historyId}
/settings/restaurant

IMAGES
------
Because this edition avoids Firebase Storage, Admin product form accepts a PUBLIC image URL.
You can use your website/CDN/image hosting URL. The URL must be directly accessible by the browser.

SECURITY
--------
Public customers can create pending reservations and pending orders only through rules.
Admin has full database control.
Captain can manage restaurant tables/bookings and read orders.
Rider can read/update only orders assigned to that rider and write its own GPS location.

PAYMENTS
--------
The 'online' option is only a payment-method field. No payment gateway is connected.
To accept real online payments, integrate Razorpay/PhonePe/Stripe/etc. separately.
