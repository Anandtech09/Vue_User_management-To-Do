import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, set } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);
const analytics = getAnalytics(app);
const realtimeDb = getDatabase(app);

// databases in todo
const taskCollection = collection(db, 'tasks');
const userCollection = collection(db, 'users');

// For user activity recording -- @Anand
export const logUserActivity = async (activity) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user is logged in.');
  }

  const activityRef = dbRef(realtimeDb, `activityLogs/${user.uid}/${Date.now()}`);

  try {
    await set(activityRef, {
      activity,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error logging user activity:', error);
    throw error;
  }
};

// For Task Management -- @Anand
export const useLoadTasks = async () => {
  const tasks = [];
  const user = auth.currentUser;

  if (!user) {
    console.warn('No user is logged in.');
    return tasks;
  }

  try {
    const q = query(taskCollection, where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      const taskData = { id: doc.id, ...doc.data() };
      if (!tasks.some(task => task.id === taskData.id)) {
        tasks.push(taskData);
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error.message, error.stack);
    throw error;
  }

  return tasks;
};


export const getTask = async (id) => {
  const docRef = doc(taskCollection, id);
  
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting task:', error);
    throw error;
  }
};

export const createTask = async (task) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user is logged in.');
  }

  try {
    const docRef = await addDoc(taskCollection, { ...task, userId: user.uid });

    // Log the event with Analytics
    logEvent(analytics, 'todo_created', { todoId: docRef.id });
    await logUserActivity('Created a new task: ' + docRef.id);

    return docRef;
  } catch (error) {
    console.error('Error creating task:', error.message, error.stack);
    throw error;
  }
};



export const updateTask = async (id, data) => {
  try {
    const docRef = doc(taskCollection, id);
    return await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user is logged in.');
  }

  const docRef = doc(taskCollection, id);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().userId === user.uid) {
      return await deleteDoc(docRef);
    } else {
      throw new Error('Unauthorized or task does not exist.');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

//For User Profile --@Anand
export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is logged in.');
  }

  const docRef = doc(userCollection, user.uid);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile.');
  }
};

export const updateUserProfile = async (profileData) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is logged in.');
  }

  const docRef = doc(userCollection, user.uid);
  try {
    await setDoc(docRef, profileData, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile.');
  }
};

export const uploadProfilePhoto = async (file) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is logged in.');
  }
  
  const fileName = `${Date.now()}_${file.name}`;
  const photoRef = storageRef(storage, `profile_photos/${user.uid}/${fileName}`);
  try {
    const snapshot = await uploadBytes(photoRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw new Error('Failed to upload profile photo.');
  }
};

export const createUserProfile = async (profileData) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is logged in.');
  }

  const docRef = doc(userCollection, user.uid);
  try {
    await setDoc(docRef, profileData, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile.');
  }
};