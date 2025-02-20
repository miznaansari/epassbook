// import { signInWithPopup, signOut, User } from "firebase/auth";
// import { auth, provider } from "./firebase";

// export const signInWithGoogle = async (): Promise<User | null> => {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     return result.user;
//   } catch (error) {
//     console.error("Google Sign-In Error:", error);
//     return null;
//   }
// };

// export const logout = async (): Promise<void> => {
//   try {
//     await signOut(auth);
//   } catch (error) {
//     console.error("Logout Error:", error);
//   }
// };
