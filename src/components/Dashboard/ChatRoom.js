import React from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button, { buttonClasses } from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import "../../App.css";

const theme = createTheme({
  palette: {
    action: {
      disabledBackground: "",
      disabled: "white",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          [`&.${buttonClasses.disabled}`]: {
            opacity: 0.7,
          },
        },
      },
    },
  },
});

function ChatBackend() {
  const { currentUser, userName, singleTicket } = useAuth();

  const dummy = useRef();
  const messageInput = useRef();
  const docId = singleTicket.projectName + "" + singleTicket.ticketName;
  const messagesRef = collection(
    db,
    "projects",
    singleTicket.projectName,
    "tickets",
    docId,
    "messages"
  );
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(25));

  const [messages] = useCollectionData(q);

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = currentUser;
    const { firstName, lastName } = userName;
    const fullName = firstName + " " + lastName;
    await addDoc(messagesRef, {
      uid,
      name: fullName,
      text: formValue,
      createdAt: serverTimestamp(),
    });
    messageInput.current.focus();
    setFormValue("");
    //dummy is updated when the component is re-rendered, instead of after a message is sent.
  };
  //Everytime messages is modified, will use the dummy reference to scroll to the bottom.
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="Chat">
        <main>
          {messages &&
            messages
              .slice(0)
              .reverse()
              .map((msg, idx) => <ChatMessage key={idx} message={msg} />)}

          <div ref={dummy} />
        </main>
      </div>

      <form onSubmit={sendMessage} className="Chat">
        <input
          ref={messageInput}
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message"
        />
        {/* <button type="submit" disabled={!formValue}>
          SUBMIT
        </button> */}
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            disabled={!formValue}
            type="submit"
            endIcon={<SendIcon />}
            sx={{ margin: "10px 10px 10px 1px" }}
          >
            Send
          </Button>
        </ThemeProvider>
      </form>
    </>
  );
}
function ChatMessage(props) {
  const { currentUser } = useAuth();
  const { text, uid, name } = props.message;
  const messageClass = uid === currentUser.uid ? "sent" : "received";
  const messageNameClass =
    uid === currentUser.uid ? "sentName" : "receivedName";

  return (
    <>
      <div className={`message ${messageNameClass}`}>
        <p>{name}</p>
      </div>
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    </>
  );
}

export default function ChatRoom() {
  return (
    <div className="App">
      <header>Comments</header>
      <section>
        <ChatBackend />
      </section>
    </div>
  );
}
