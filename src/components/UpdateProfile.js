import React, { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {" © "}
      <Link color="inherit" href="https://mui.com/">
        Jose Del Rosario
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const theme = createTheme();

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateEmails, updatePasswords } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not Match");
    }
    if (passwordRef.current.value.length < 6) {
      return setError("Password should be at least 6 characters long");
    }

    const promises = [];
    setLoading(true);
    setError("");
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmails(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePasswords(passwordRef.current.value));
    }
    Promise.all(promises)
      .then(() => {
        history("/dashboard");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs" sx={{}}>
          <CssBaseline />
          <div>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                marginTop: 8,
                marginBottom: 5,
                textAlign: "center",
              }}
            >
              <img
                src={`https://www.gstatic.com/buganizer/img/v0/logo.svg`}
                alt="bugtrackerImage"
                style={{
                  width: "40px",
                  height: "40px",
                  position: "relative",
                  top: 8,
                  marginRight: 8,
                }}
              />
              Bug Tracker
            </Typography>
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "10px ",
              backgroundColor: "white",
            }}
          >
            {error && (
              <Alert severity="error" sx={{ width: "95%", mt: 1 }}>
                {error}
              </Alert>
            )}

            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" color="" sx={{ m: 1 }}>
              Update Profile
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 2,
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                defaultValue={currentUser.email}
                inputRef={emailRef}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                placeholder="Leave blank to keep the same"
                inputRef={passwordRef}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="confirmpassword"
                autoComplete="current-password"
                placeholder="Leave blank to keep the same"
                inputRef={passwordConfirmRef}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                Update
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link component={RouterLink} to="/dashboard" variant="body2">
                    Cancel
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </>
  );
}
