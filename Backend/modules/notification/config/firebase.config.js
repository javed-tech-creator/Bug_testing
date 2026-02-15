// import admin from "firebase-admin";
// import serviceAccount from "./firebaseServiceAccount.json" assert { type: "json" };

// export const firebaseApp = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export default admin;

import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(new URL("./firebaseServiceAccount.json", import.meta.url))
);

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

