import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
// TODO handle button submit by using database to post project data
function preventDefault(event) {
  event.preventDefault();
}
const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Deposits() {
  const { currentUser, userName, allUsers, setAllUsers } = useAuth();
  // const usersCollectionRef = doc(db, "users", currentUser.uid);
  // const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const projectNameRef = useRef();
  const projectDescriptionRef = useRef();
  const [checked, setChecked] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setChecked([]);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  useEffect(() => {
    const sortByName = () => {
      setAllUsers((data) => {
        const dataToSort = [...data];
        dataToSort.sort((a, b) => a.firstName.localeCompare(b.firstName));
        return dataToSort;
      });
    };
    sortByName();
  }, []);

  // console.log(checked);
  // useEffect(() => {
  //   const getUsers = async () => {
  //     const data = await getDoc(usersCollectionRef);
  //     setUsers(data.data());
  //   };
  //   getUsers();
  // }, []);
  // console.log(allUsers);
  // console.log(userName);
  return (
    <React.Fragment>
      <Title>Welcome,</Title>
      <Typography component="p" variant="h4">
        {/* {users && <div>{users.firstName + " " + users.lastName}</div>} */}
        {userName.firstName + " " + userName.lastName}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={handleOpen}>
          Create Project
        </Link>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": { m: 1, width: "45ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <h5>Create New Project</h5>
                </div>
                <br />
                <div>
                  <h4>Project Name</h4>
                  <TextField
                    id="outlined-multiline-static"
                    label="Project Name"
                    multiline
                    rows={1}
                    defaultValue=""
                    inputRef={projectNameRef}
                  />
                </div>
                <div>
                  <h4>Project Description</h4>
                  <TextField
                    id="outlined-multiline-static"
                    label="Project Description"
                    multiline
                    rows={4}
                    defaultValue=""
                    inputRef={projectDescriptionRef}
                  />
                </div>
                <div>
                  <h4>Add Team Members</h4>
                  {/* <TextField
                    id="outlined-multiline-static"
                    label="Project Description"
                    multiline
                    rows={3}
                    defaultValue=""
                  /> */}
                  <List
                    dense
                    sx={{
                      width: "100%",
                      maxWidth: "45ch",
                      overflow: "auto",
                      maxHeight: 200,
                      bgcolor: "background.paper",
                      border: 0,
                    }}
                  >
                    {allUsers.map((value) => {
                      const labelId = `checkbox-list-secondary-label-${value.id}`;
                      return (
                        <ListItem
                          key={value.id}
                          secondaryAction={
                            <Checkbox
                              edge="end"
                              onChange={handleToggle(value)}
                              checked={checked.indexOf(value) !== -1}
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          }
                          disablePadding
                        >
                          <ListItemButton>
                            <ListItemText
                              id={labelId}
                              primary={`${value.firstName} ${value.lastName}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
                <Button variant="contained">Submit</Button>
              </Box>
            </Typography>
          </Box>
        </Modal>
      </div>
    </React.Fragment>
  );
}
