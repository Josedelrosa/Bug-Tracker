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
import MuiPhoneNumber from "material-ui-phone-number";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const theme = createTheme();

export default function Signup() {
  const firstName = useRef();
  const lastName = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  function handleOnChange(value) {
    setPhone(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (phone.replace(/\D/g, "").length < 7) {
      return setError("No valid phone number was input");
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      console.log(phone.replace(/\D/g, ""));
      return setError("Passwords do not Match");
    }
    if (passwordRef.current.value.length < 6) {
      return setError("Password should be at least 6 characters long");
    }

    try {
      setError("");
      setLoading(true);
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        firstName.current.value,
        lastName.current.value,
        phone
      );
      history("/dashboard");
    } catch (error) {
      setError("Failed to create an account");
      console.log(error);
    }

    setLoading(false);
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
                  bottom: 3,
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
              Sign Up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    autoComplete="given-name"
                    margin="normal"
                    fullWidth
                    name="firstName"
                    id="firstName"
                    label="First Name"
                    autoFocus
                    inputRef={firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    margin="normal"
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    inputRef={lastName}
                  />
                </Grid>
              </Grid>
              <TextField
                required
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputRef={emailRef}
              />
              <MuiPhoneNumber
                required
                margin="normal"
                fullWidth
                variant="outlined"
                name="phone"
                defaultCountry={"us"}
                onChange={handleOnChange}
                label="Phone Number"
              />
              <TextField
                required
                fullWidth
                margin="normal"
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
              />
              <TextField
                required
                margin="normal"
                fullWidth
                name="confirm password"
                label="Confirm Password"
                type="password"
                id="cofirm password"
                autoComplete="current-confirm-password"
                inputRef={passwordConfirmRef}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "Loading…" : "Sign Up"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign In
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
