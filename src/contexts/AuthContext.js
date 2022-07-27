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
  updateDoc,
  arrayRemove,
  arrayUnion,
  addDoc,
  serverTimestamp,
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
  const [singleProject, setSingleProject] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [singleTicket, setSingleTicket] = useState([]);
  const [currentUserTickets, setCurrentUserTickets] = useState([]);
  // add email to signup
  const signup = async (email, password, firstName, lastName, phoneNumber) => {
    // return auth.createUserWithEmailAndPassword(email, password);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", result.user.uid), {
      firstName,
      lastName,
      email,
      phoneNumber,
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
    const docRef = doc(db, "projects", projectName);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        projectDescription,
        members,
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("Can't create duplicate Projects!");
    }
  };
  const deleteProjects = async (projectName) => {
    await deleteDoc(doc(db, "projects", projectName));

    // add this to later
    // const subcolRef = collection(
    //   db,
    //   "parentCollectionTitle",
    //   "parentDocId",
    //   "subcollectionTitle"
    // );
    // const subcolSnapshot = await getDocs(subcollectionRef);

    // if (!subcolSnapshot.empty) {
    //   console.log("subcol does exists!");
    // } else {
    //   console.log("subcol does NOT exist!");
    // }
  };
  const getProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    setProjects(
      querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };
  const getSingleProject = async (projectName) => {
    const docRef = doc(db, "cities", projectName);
    const docSnap = await getDoc(docRef);
    setSingleProject(docSnap.data());
    //not used
  };

  const deleteMembers = async (projectName, memberId) => {
    const projectRef = doc(db, "projects", projectName);
    await updateDoc(projectRef, {
      members: arrayRemove(memberId),
    });
  };

  const addMembers = async (projectName, members) => {
    const projectRef = doc(db, "projects", projectName);
    await updateDoc(projectRef, {
      members,
    });
  };

  const addTickets = async (
    projectName,
    ticketName,
    ticketDescription,
    time,
    members,
    type,
    priority,
    status,
    createdBy,
    userId,
    ticketId
  ) => {
    // await addDoc(
    //   collection(db, `projects/${projectName}/tickets`, ticketName),
    //   {
    //     ticketDescription,
    //   }
    // );

    // const messageRef = doc(db, `projects/${projectName}/tickets`, ticketName);

    const docRef = doc(db, "projects", projectName);
    const colRef = doc(docRef, "tickets", ticketId);
    const docSnap = await getDoc(colRef);

    if (!docSnap.exists()) {
      await setDoc(colRef, {
        projectName,
        ticketName,
        ticketDescription,
        time,
        members,
        type,
        priority,
        status,
        createdBy,
        userId,
      });
    } else {
      console.log("Can't create duplicate Ticket with the same name!");
    }
  };
  const deleteTickets = async (projectName, ticketId) => {
    const docRef = doc(db, "projects", projectName);
    const colRef = doc(docRef, "tickets", ticketId);
    await deleteDoc(colRef);
  };

  const getTickets = async (projectName) => {
    const querySnapshot = await getDocs(
      collection(db, "projects", projectName, "tickets")
    );
    setTickets(
      querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  const editTicket = async (
    projectName,
    ticketName,
    ticketDescription,
    time,
    members,
    type,
    priority,
    status,
    createdBy,
    userId,
    ticketId
  ) => {
    const docRef = doc(db, "projects", projectName);
    const colRef = doc(docRef, "tickets", ticketId);
    await setDoc(colRef, {
      projectName,
      ticketName,
      ticketDescription,
      time,
      members,
      type,
      priority,
      status,
      createdBy,
      userId,
    });
  };
  const addUserTickets = async (
    projectName,
    ticketName,
    ticketDescription,
    time,
    members,
    type,
    priority,
    status,
    createdBy,
    userId,
    ticketId
  ) => {
    const docRef = doc(db, "users", userId);
    const colRef = doc(docRef, "tickets", ticketId);
    const docSnap = await getDoc(colRef);

    if (!docSnap.exists()) {
      await setDoc(colRef, {
        projectName,
        ticketName,
        ticketDescription,
        time,
        members,
        type,
        priority,
        status,
        createdBy,
        createdAt: serverTimestamp(),
      });
    } else {
      console.log("Cant Create Duplicate Ticket");
    }
  };

  const getUserTickets = async (userID) => {
    const querySnapshot = await getDocs(
      collection(db, "users", userID, "tickets")
    );
    setCurrentUserTickets(
      querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  const deleteUserTickets = async (ticketId, userId) => {
    const docRefUser = doc(db, "users", userId);
    const colRefUser = doc(docRefUser, "tickets", ticketId);
    await deleteDoc(colRefUser);
  };

  const editUserTicket = async (
    projectName,
    ticketName,
    ticketDescription,
    time,
    members,
    type,
    priority,
    status,
    createdBy,
    userId,
    ticketId
  ) => {
    const docRef = doc(db, "users", userId);
    const colRef = doc(docRef, "tickets", ticketId);
    await setDoc(colRef, {
      projectName,
      ticketName,
      ticketDescription,
      time,
      members,
      type,
      priority,
      status,
      createdBy,
      createdAt: serverTimestamp(),
    });
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
          // add , id: uid
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
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              email: doc.data().email,
            }))
          );
          // change to querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, firstName: doc.data().firstName, lastName: doc.data().lastName, email: doc.data().email }))

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
    singleProject,
    tickets,
    singleTicket,
    currentUserTickets,
    setSingleTicket,
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
    getSingleProject,
    deleteMembers,
    addMembers,
    addTickets,
    getTickets,
    deleteTickets,
    editTicket,
    addUserTickets,
    setCurrentUserTickets,
    getUserTickets,
    deleteUserTickets,
    editUserTicket,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
