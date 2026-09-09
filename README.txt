BON AMIGOS - ADMIN + CAPTAIN + TABLE BOOKING

Files:
- index.html: customer website (Firebase config installed)
- admin.html: admin login/dashboard
- captain.html: captain-only login/dashboard
- firestore.rules: Firestore security rules
- storage.rules: product image rules
- manifest.webmanifest + sw.js + icons: PWA shell

FIRST SETUP
1. Firebase Console > Authentication > Sign-in method > Email/Password ON.
2. Create Firestore database.
3. Add your first admin user in Authentication > Users.
4. In Firestore create collection `admins`, document ID = the admin user's UID, field/value: document value boolean true (or field `isAdmin: true` would NOT match these rules).
5. Publish firestore.rules and storage.rules.
6. Upload all files to the same hosting root.
7. Open /admin.html, login as admin, add tables and create captain accounts.
8. Captains use /captain.html.

IMPORTANT
The Firebase web API key is not a password; security comes from Authentication and Firebase Rules. Never put a service-account private key in browser code.

Captain creation uses Firebase Identity Toolkit sign-up API so it does not require exposing an Admin SDK service account.
