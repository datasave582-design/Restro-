BON AMIGOS FINAL STABLE

1) Replace ALL website files.
2) Firebase Authentication: enable Email/Password.
3) Realtime Database: publish database.rules.json.
4) Existing Admin/Rider/Captain Firebase accounts must have matching /admins/{UID} or /staff/{UID} record.
5) If a role account is authenticated but its staff record is missing, Admin must create/enable the staff record.
6) Clear old service worker/cache once after deployment (Incognito is easiest).
7) Customer orders do not save null GPS fields; GPS is optional.
