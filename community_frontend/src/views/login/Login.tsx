import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "../../api";
import { AxiosResponse } from "axios";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material/";
import { message } from "mui-message";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import Copyright from "../../components/copyright/Copyright";
import { useNavigate } from "react-router";
import { UserStoreContext } from "../../store/UserStore";

export default function Login() {
  const userStore = useContext(UserStoreContext);

  const navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  useEffect(() => {
    if (authenticated) {
      navigate("/app/dashboard");
    }
  });

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });
    try {
      const res: AxiosResponse = await axios.post("/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
      });
      dispatch("LOGIN", res.data);
      userStore.login(res.data?.user);
      if (res.status === 200) {
        message.success("登陆成功");
        navigate("/app/dashboard");
      } else message.error("登陆失败");
    } catch (error) {
      message.error("登陆失败");
      console.log(error);
    }
  };

  const handleEmailChange = (event: any) => {
    setEmail(event.target?.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target?.value);
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validateEmail = (email: string) => {
    // 此处使用简单的正则表达式验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return (password.length < 2 || password.length > 80) && password !== "";
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
          Sign in
        </Typography>
        <Box component={"form"} onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleEmailChange}
            error={!validateEmail(email) && email != ""}
            helperText={!validateEmail(email) ? "请输入有效的邮箱" : ""}
          />
          {/* <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
          /> */}
          <FormControl sx={{ mt: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="password" sx={{ width: "100%" }}>
              Password
            </InputLabel>
            <OutlinedInput
              required
              fullWidth
              id="password"
              name="password"
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
              label="Password"
              onChange={handlePasswordChange}
              error={validatePassword(password)}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign in
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forget" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
