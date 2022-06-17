import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  getDocs,
  collection,
  orderBy,
  query,
} from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userName, setUserName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  // add email to signup
  const signup = async (email, password, firstName, lastName) => {
    // return auth.createUserWithEmailAndPassword(email, password);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", result.user.uid), {
      firstName,
      lastName,
    });
  };
  const login = async (email, password) => {
    // return auth.signInWithEmailAndPassword(email, password);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    // return auth.signOut();
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    // return auth.sendPasswordResetEmail(email);
    await sendPasswordResetEmail(auth, email);
  };

  const updateEmails = async (email) => {
    // return currentUser.updateEmail(email);
    await updateEmail(currentUser, email);
  };
  const updatePasswords = async (password) => {
    // return currentUser.updatePassword(password);
    await updatePassword(currentUser, password);
  };
  // create the project to add members
  const createProjects = async (projectName, projectDescription, members) => {
    // const [a] = members;
    await setDoc(doc(db, "projects", projectName), {
      projectDescription,
      members,
    });
  };
  const deleteProjects = async (projectName) => {
    await deleteDoc(doc(db, "projects", projectName));
  };
  const getProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    setProjects(
      querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  // useEffect(() => {
  //   const getUsers = async () => {
  //     const usersCollectionRef = doc(db, "users", currentUser.uid);
  //     const data = await getDoc(usersCollectionRef);
  //     setUserName(data.data());
  //   };
  //   getUsers();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const uid = user.uid;
        const usersCollectionRef = doc(db, "users", uid);

        const getUsers = async () => {
          const data = await getDoc(usersCollectionRef);
          setUserName(data.data());
        };

        getUsers();

        // const getProjects = async () => {
        //   const querySnapshot = await getDocs(collection(db, "projects"));
        //   setProjects(
        //     querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        //   );
        // };
        getProjects();

        const getAllUsers = async () => {
          const querySnapshot = await getDocs(collection(db, "users"));
          setAllUsers(
            querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );

          // this will order users by name
          setAllUsers((data) => {
            const dataToSort = [...data];
            dataToSort.sort((a, b) => a.firstName.localeCompare(b.firstName));
            return dataToSort;
          });

          // querySnapshot.forEach((doc) => {
          //   // doc.data() is never undefined for query doc snapshots
          //   console.log(doc.id, " => ", doc.data());
          // });
        };
        getAllUsers();
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    userName,
    allUsers,
    projects,
    setAllUsers,
    login,
    logout,
    signup,
    resetPassword,
    updateEmails,
    updatePasswords,
    createProjects,
    getProjects,
    deleteProjects,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
