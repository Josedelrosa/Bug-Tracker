import * as React from "react";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import FormLabel from "@mui/material/FormLabel";

const style = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddMembers({
  currentMembers,
  projectId,
  setCurrentMembers,
}) {
  const { allUsers, addMembers, getProjects } = useAuth();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError("");
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (checked.length === 0) {
      return setError("No members where selected");
    }

    const mergeResult = [...currentMembers, ...checked];

    try {
      setError("");
      setLoading(true);
      await addMembers(projectId, mergeResult);
      await getProjects();
      setCurrentMembers(mergeResult);
      handleClose();
    } catch (error) {
      setError("Failed to add team members");
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <React.Fragment>
      <Tooltip title="Add Members">
        <AddIcon onClick={handleOpen} sx={{ color: "white" }} />
      </Tooltip>
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
              {error && (
                <Alert variant="outlined" severity="error">
                  {error}
                </Alert>
              )}
              <div>
                <FormLabel sx={{ color: "black", fontWeight: "bold" }}>
                  Add Team Members
                </FormLabel>
                <List
                  dense
                  sx={{
                    width: "100%",
                    maxWidth: "45ch",
                    overflow: "auto",
                    maxHeight: 200,
                    bgcolor: "background.paper",
                    border: "solid",
                    marginBottom: 1,
                  }}
                >
                  {allUsers
                    .filter(
                      (item) =>
                        !currentMembers.some(
                          (currentMembers) => currentMembers.id === item.id
                        )
                    )
                    .map((value) => {
                      const labelId = `checkbox-list-secondary-label-${value.id}`;
                      const fullname = value.firstName + " " + value.lastName;
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
                              primary={`${fullname}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                </List>
              </div>
              <Button
                variant="contained"
                type="submit"
                disabled={currentMembers.length === allUsers.length || loading}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Typography>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
