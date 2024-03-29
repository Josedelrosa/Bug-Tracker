import * as React from "react";
import { useState, useRef } from "react";
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
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import EditIcon from "@mui/icons-material/Edit";

const style = {
  position: "absolute",
  top: "44%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EditTicket({ currentMembers, projectId, ticketInfo }) {
  const {
    getProjects,
    getTickets,
    getUserTickets,
    currentUser,
    editTicket,
    editUserTicket,
  } = useAuth();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const ticketNameRef = useRef();
  const ticketDescriptionRef = useRef();
  const time = useRef();
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(ticketInfo.type);
  const [priority, setPriority] = useState(ticketInfo.priority);
  const [status, setStatus] = useState(ticketInfo.status);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError("");
    setChecked([]);
    setType(ticketInfo.type);
    setPriority(ticketInfo.priority);
    setStatus(ticketInfo.status);
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

    // const createdBy = firstName + " " + lastName;
    const createdBy = ticketInfo.createdBy;
    const ticketId = projectId + "" + ticketNameRef.current.value;

    if (checked.length === 0) {
      return setError("No members where selected");
    }

    try {
      setError("");
      setLoading(true);
      // create an trackTicket for user that imports the data necessary
      await editTicket(
        projectId,
        ticketNameRef.current.value,
        ticketDescriptionRef.current.value,
        time.current.value,
        checked,
        type,
        priority,
        status,
        createdBy,
        currentUser.uid,
        ticketId
      );
      await editUserTicket(
        projectId,
        ticketNameRef.current.value,
        ticketDescriptionRef.current.value,
        time.current.value,
        checked,
        type,
        priority,
        status,
        createdBy,
        currentUser.uid,
        ticketId
      );
      await getProjects();
      await getTickets(projectId);
      await getUserTickets(currentUser.uid);
      handleClose();
    } catch (error) {
      setError("Failed to add tickets");
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <React.Fragment>
      <Tooltip title="Add Tickets">
        <EditIcon onClick={handleOpen} />
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
              // sx={{
              //   "& .MuiTextField-root": { m: 1, width: "45ch" },
              // }}

              autoComplete="off"
              onSubmit={handleSubmit}
            >
              {error && (
                <Alert variant="outlined" severity="error">
                  {error}
                </Alert>
              )}

              <div>
                <FormLabel sx={{ color: "black", fontWeight: "bold" }}>
                  Title
                </FormLabel>
                <TextField
                  sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    marginBottom: 1,
                  }}
                  id="outlined-multiline-static"
                  placeholder="Enter Ticket Title"
                  multiline
                  fullWidth
                  rows={1}
                  defaultValue={ticketInfo.ticketName}
                  inputRef={ticketNameRef}
                  disabled
                />
              </div>
              <div>
                <FormLabel sx={{ color: "black", fontWeight: "bold" }}>
                  Ticket Description
                </FormLabel>
                <TextField
                  sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    marginBottom: 1,
                  }}
                  id="outlined-multiline-static"
                  placeholder="Enter Description"
                  multiline
                  fullWidth
                  rows={4}
                  defaultValue={ticketInfo.ticketDescription}
                  inputRef={ticketDescriptionRef}
                  required
                />
              </div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormLabel sx={{ color: "black", fontWeight: "bold" }}>
                    Assign Devs
                  </FormLabel>
                  <List
                    dense
                    sx={{
                      width: "100%",
                      maxWidth: "45ch",
                      overflow: "auto",
                      maxHeight: 200,
                      bgcolor: "background.paper",
                      border: 1,
                      borderRadius: "10px",
                      marginBottom: 1,
                    }}
                  >
                    {currentMembers.map((value) => {
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
                </Grid>
                <Grid item xs={6}>
                  <FormLabel sx={{ color: "black", fontWeight: "bold" }}>
                    Time Estimate (Hours)
                  </FormLabel>
                  <TextField
                    sx={{
                      "& legend": { display: "none" },
                      "& fieldset": { top: 0 },
                    }}
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    id="outlined-basic"
                    placeholder="0"
                    defaultValue={ticketInfo.time}
                    fullWidth
                    rows={1}
                    type="number"
                    inputRef={time}
                    required
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <InputLabel sx={{ color: "black", fontWeight: "bold" }}>
                    Type
                  </InputLabel>
                  <FormControl sx={{ mt: 1, minWidth: 150 }}>
                    <Select
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                      }}
                      value={type}
                      onChange={handleTypeChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"Issue"}>Issue</MenuItem>
                      <MenuItem value={"Bug"}>Bug</MenuItem>
                      <MenuItem value={"High"}>High</MenuItem>
                      <MenuItem value={"Error"}>Error</MenuItem>
                      <MenuItem value={"Feature Request"}>
                        Feature Request
                      </MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <InputLabel sx={{ color: "black", fontWeight: "bold" }}>
                    Priority
                  </InputLabel>
                  <FormControl sx={{ mt: 1, minWidth: 150 }}>
                    <Select
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                      }}
                      value={priority}
                      onChange={handlePriorityChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"Low"}>Low</MenuItem>
                      <MenuItem value={"Medium"}>Medium</MenuItem>
                      <MenuItem value={"High"}>High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <InputLabel sx={{ color: "black", fontWeight: "bold" }}>
                    Status
                  </InputLabel>
                  <FormControl sx={{ mt: 1, minWidth: 150 }}>
                    <Select
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                      }}
                      value={status}
                      onChange={handleStatusChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"New"}>New</MenuItem>
                      <MenuItem value={"Open"}>Open</MenuItem>
                      <MenuItem value={"In progress"}>In progress</MenuItem>
                      <MenuItem value={"To be tested"}>To be tested</MenuItem>
                      <MenuItem value={"Closed"}>Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                sx={{ mt: 1 }}
                variant="contained"
                type="submit"
                disabled={loading}
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
