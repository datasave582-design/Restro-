BON AMIGOS FINAL - READY TO USE

Firebase project: restro-56bc7

IMPORTANT DEPLOY STEPS
1. Upload all files in this folder to the same hosting root.
2. Firebase Console -> Authentication -> Sign-in method -> Email/Password: ENABLE.
3. Firebase Console -> Realtime Database -> Rules: paste database.rules.json and Publish.
4. Open index.html once in a private/incognito tab after deployment to avoid old service-worker cache.
5. Admin: sign in with an existing Firebase Auth admin account that is present under /admins/{uid}=true, /admins/{uid}.isAdmin=true, /adminEmails/{uid}=true, or /staff/{uid}.role="admin".
6. Captain/Rider: Firebase Auth email/password account must exist AND /staff/{uid} must contain role="captain" or role="rider", active=true.
7. Create staff accounts from Admin -> Captains/Riders after admin login. The admin page creates Firebase Auth users and staff records.

FIXES IN THIS BUILD
- Admin authentication checks admins, adminEmails, and staff role=admin.
- Firebase rules recognize admin staff role as well as existing admin records.
- Customer email/password login persists locally and customer can order/book only while authenticated.
- Fixed customer auth logout listener bug.
- Customer order write permission and validation flow fixed.
- Customer reservation write/query flow fixed.
- Captain walk-in reservations are allowed without customerUid.
- Rider assigned-order query is restricted to the logged-in rider.
- Rider GPS can be removed when duty is turned off.
- Admin product form now actually saves products.
- Product images are selected from the PC/mobile file picker and compressed to JPEG data before saving; no remote image URL is required.
- Delivery settings: enabled/disabled, fee, free-delivery threshold.
- Table waiting queue and TV display retained.
- Order, table, rider and captain dashboards retained.

SECURITY NOTE
Do not publish service-account private keys in the web files. The Firebase web config is intended for client use; access is controlled by Realtime Database Rules.
