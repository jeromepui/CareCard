import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid2";
import { Auth } from "./Supabase";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    Auth(email, password);
  };

  return (
    <>
      <Container component="main" maxWidth={false}>
        <CssBaseline />
        <AppBar
          position="static"
          color="primary"
          sx={{ bgcolor: "#00a17b", borderRadius: 2 }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              CareCard
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container justifyContent="center">
          <Grid xs={12} sm={8} md={6} lg={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                padding: 3,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                omponent="h1"
                variant="h5"
                sx={{ color: "#333", marginBottom: 2 }}
              >
                CareCard
              </Typography>
              <Box component={"form"} onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email/User ID"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiInputLabel-root": { color: "#666" }, // label color
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" }, // border color
                      "&.Mui-focused fieldset": {
                        borderColor: "#00a17b", // border color when focused
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiInputLabel-root": { color: "#666" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00a17b", // this changes the border color of password field
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <Button
                    type="button"
                    variant="text"
                    sx={{
                      position: "relative",
                      bottom: 8,
                      right: 8,
                      mt: 1,
                      mb: 2,
                      color: "#666",
                      textTransform: "none",
                      padding: 0,
                      minHeight: 0,
                      minWidth: 0,
                      fontSize: "0.75rem",
                    }}
                    onClick={() => console.log("Forgot details clicked")} // do something here for forget password magic link
                  >
                    Forget login details?
                  </Button>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 0,
                    mb: 2,
                    bgcolor: "#00a17b",
                    textTransform: "none",
                  }}
                >
                  Log in
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default LoginForm;
