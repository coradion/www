import { User } from "firebase/auth";
import { CoradionServiceWorkerState } from "./types";
import { addDoc, collection } from "firebase/firestore";

const sanitizeUser = (user: User | null) => {
  if (user === null) return null;
  const { displayName, email, emailVerified, metadata, phoneNumber, photoURL } =
    user;
  return {
    displayName,
    email,
    emailVerified,
    metadata,
    phoneNumber,
    photoURL,
  };
};

export const getUser = ({ auth }: CoradionServiceWorkerState) =>
  sanitizeUser(auth.currentUser);

export const createTask = async ({ firestore }: CoradionServiceWorkerState, task: any) => {
  const tasksCollection = collection(firestore, "tasks");
  console.log("got task", task);
  return addDoc(tasksCollection, task).then(console.log).catch(console.error);
};
