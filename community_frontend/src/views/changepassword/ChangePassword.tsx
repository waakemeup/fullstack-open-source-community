import React, { useContext, useState } from "react";
import { UserStoreContext } from "../../store/UserStore";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "../../api";
import { message } from "mui-message";
import { useNavigate } from "react-router";

function ChangePassword() {
  const navigate = useNavigate();
  const userStore = useContext(UserStoreContext);
  const [newPassword, setNewPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword2, setNewPassword2] = useState<string>("");

  const handleNewPasswordChange = (event: any) => {
    setNewPassword(event.target?.value);
  };

  const handleOldPasswordChange = (event: any) => {
    setOldPassword(event.target?.value);
  };

  const handleNewPassword2Change = (event: any) => {
    setNewPassword2(event.target?.value);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClickShowOldPassword = () => {
    setShowOldPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log(123);
    try {
      const res = await axios.post("user/updatepassword", {
        oldPassword,
        newPassword,
        newPassword2,
      });
      message.success("修改密码成功");
      userStore.logout();
      navigate("/login");
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message);
    }
  };

  const validatePassword = (password: string) => {
    return (password.length < 2 || password.length > 80) && password !== "";
  };

  const validatePasswordAgain = (password2: string) => {
    return password2 !== newPassword;
  };

  return (
    <Container component={"main"} maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component={"h1"} variant="h5">
          ChangePassword
        </Typography>
        <Box
          component={"form"}
          onSubmit={handleSubmit}
          sx={{
            mt: 1,
            width: "40vw",
            "@media (max-width: 620px)": { width: "60vw" },
          }}
        >
          <FormControl sx={{ mt: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="username" sx={{ width: "100%" }}>
              username
            </InputLabel>
            <OutlinedInput
              id="username"
              name="username"
              label="username"
              disabled
              value={userStore.user?.username}
            />
          </FormControl>
          <FormControl sx={{ mt: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="email" sx={{ width: "100%" }}>
              email
            </InputLabel>
            <OutlinedInput
              id="email"
              name="email"
              label="email"
              disabled
              value={userStore.user?.email}
            />
          </FormControl>
          <FormControl sx={{ mt: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="oldpassword" sx={{ width: "100%" }}>
              OldPassword
            </InputLabel>
            <OutlinedInput
              required
              fullWidth
              id="oldpassword"
              name="oldpassword"
              type={showOldPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowOldPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="newpassword"
              onChange={handleOldPasswordChange}
              error={validatePassword(oldPassword as string)}
            />
          </FormControl>
          <FormControl sx={{ mt: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="newpassword" sx={{ width: "100%" }}>
              NewPassword
            </InputLabel>
            <OutlinedInput
              required
              fullWidth
              id="newpassword"
              name="newpassword"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="newpassword"
              onChange={handleNewPasswordChange}
              error={validatePassword(newPassword as string)}
            />
          </FormControl>
          <FormControl sx={{ mt: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="newpasswordagain" sx={{ width: "100%" }}>
              NewPasswordAgain
            </InputLabel>
            <OutlinedInput
              required
              fullWidth
              id="newpasswordagain"
              name="newpasswordagain"
              label="newpasswordagain"
              type="password"
              onChange={handleNewPassword2Change}
              error={validatePasswordAgain(newPassword2 as string)}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Change Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ChangePassword;
