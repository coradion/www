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

export const createTask = async ({ firestore, auth }: CoradionServiceWorkerState, task: any) => {
  if(auth.currentUser === null) {
    console.warn("tried creating a task without being logged in");
    return;
  }
  const tasksCollection = collection(firestore, "tasks");
  task.creator = { uid: auth.currentUser.uid}
  return addDoc(tasksCollection, task).then(console.log).catch(console.error);
};

export const getTasks = ({ tasks }: CoradionServiceWorkerState, _: undefined) => tasks;
