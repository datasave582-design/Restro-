BON AMIGOS — CUSTOMER LOGIN UPDATE

Customer ordering and table reservation now require Firebase Email/Password authentication.

1. Firebase Console > Authentication > Sign-in method > enable Email/Password.
2. Deploy the included database.rules.json to Realtime Database > Rules.
3. Customer flow:
   - Menu can be viewed without login.
   - Add to Order / Order Online / Book a Table opens Login when signed out.
   - Create account asks for Email + Mobile Number + Password.
   - Login uses Email + Password.
   - Firebase Auth persistence is LOCAL, so the customer stays signed in on that device.
4. Customer profile is saved at /customers/{uid}.
5. Orders save customerUid/customerEmail. Reservations save customerUid/customerEmail.
6. Admin/staff/rider access remains controlled by their existing roles.

IMPORTANT: Existing customer/order records created before this update may not have customerUid. Admin can still access them; customers can only access their own newly-created records.
