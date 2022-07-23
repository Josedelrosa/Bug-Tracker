import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { useAuth } from "../../contexts/AuthContext";
export default function TicketInfo() {
  const { singleTicket } = useAuth();
  return (
    <>
      <Paper
        sx={{
          p: 2,
          margin: "auto",
          flexGrow: 1,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography
              sx={{ fontWeight: 550, mb: 1 }}
              gutterBottom
              variant="body2"
              component="div"
            >
              Ticket Title
            </Typography>
            <Chip label={singleTicket.ticketName} />
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{ fontWeight: 550, mb: 1 }}
              gutterBottom
              variant="body2"
              component="div"
            >
              Author
            </Typography>
            <Chip label={singleTicket.createdBy} />
          </Grid>
          <Grid item xs={6}>
            <Typography
              sx={{ fontWeight: 550, mb: 1 }}
              gutterBottom
              variant="body2"
              component="div"
            >
              Description
            </Typography>
            <Chip label={singleTicket.ticketDescription} />
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{ fontWeight: 550, mb: 1 }}
              gutterBottom
              variant="body2"
            >
              Status
            </Typography>
            <Chip label={singleTicket.status} color="primary" />
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{ fontWeight: 550, mb: 1 }}
              gutterBottom
              variant="body2"
            >
              Priority
            </Typography>
            <Chip label={singleTicket.priority} color="primary" />
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{ fontWeight: 550, mb: 1 }}
              gutterBottom
              variant="body2"
            >
              Type
            </Typography>
            <Chip label={singleTicket.type} color="primary" />
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{ fontWeight: 550, mb: 1 }}
              gutterBottom
              variant="body2"
            >
              Time Estimate (Hours)
            </Typography>
            <Chip label={singleTicket.time} color="primary" />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid item xs={12}>
          <Typography
            sx={{ fontWeight: 550, mb: 1 }}
            gutterBottom
            variant="body2"
          >
            Assigned Developers
          </Typography>
          {singleTicket.members.map((person) => (
            <Chip
              key={person.id}
              sx={{ mr: 1, mb: 1 }}
              label={person.firstName + " " + person.lastName}
              variant="outlined"
            />
          ))}
        </Grid>
      </Paper>
    </>
  );
}
