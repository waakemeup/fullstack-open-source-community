import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RoleEnum from "../../types/enums/RoleEnum";
import LevelEnum from "../../types/enums/LevelEnum";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useNavigate } from "react-router";
import { message } from "mui-message";
import axios from "../../api";
import { AxiosResponse } from "axios";

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<RoleEnum>(RoleEnum.USER);
  const [level, setLevel] = useState<LevelEnum>(LevelEnum.STUDENT);

  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  useEffect(() => {
    if (authenticated) {
      navigate("/auth");
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ email, password, name, username, role, level });

    try {
      const res: AxiosResponse = await axios.post("/auth/register", {
        email,
        password,
        name,
        username,
        role,
        level,
      });

      console.log(res);
      dispatch("REGISTER", res.data);
      navigate("/auth");
      if (res.status === 201) {
        message.success("注册成功");
        navigate("/auth");
      } else message.error("注册失败");
    } catch (error) {
      message.error("注册失败");
      console.log(error);
    }
  };
  const handleEmailOnchange = (event: any) => {
    setEmail(event.target?.value);
  };
  const handleNameOnchange = (event: any) => {
    setName(event.target?.value);
  };
  const handleUsernameOnchange = (event: any) => {
    setUsername(event.target?.value);
  };
  const handlePasswordOnchange = (event: any) => {
    setPassword(event.target?.value);
  };

  const validateEmail = (email: string) => {
    // 此处使用简单的正则表达式验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return (password.length < 7 || password.length > 80) && password !== "";
  };

  const handleRoleOnchange = (event: SelectChangeEvent) => {
    setRole(Number(event.target?.value));
  };
  const handleLevelOnchange = (event: SelectChangeEvent) => {
    setLevel(Number(event.target?.value));
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
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                onChange={handleNameOnchange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={handleUsernameOnchange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleEmailOnchange}
                error={!validateEmail(email) && email != ""}
                helperText={!validateEmail(email) ? "请输入有效的邮箱" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                onChange={handlePasswordOnchange}
                error={validatePassword(password)}
                helperText={
                  validatePassword(password) ? "请输入长度在7-80之间的密码" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="role-helper-label">Role</InputLabel>
              <Select
                labelId="role-helper-label"
                id="role-label"
                value={String(role)}
                label="Role"
                onChange={handleRoleOnchange}
                fullWidth
              >
                <MenuItem value={RoleEnum.ADMIN}>管理员</MenuItem>
                <MenuItem value={RoleEnum.USER}>用户</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="level-helper-label">Level</InputLabel>
              <Select
                labelId="level-helper-label"
                id="level-label"
                value={String(level)}
                label="Level"
                onChange={handleLevelOnchange}
                fullWidth
              >
                <MenuItem value={LevelEnum.HEADER}>社长</MenuItem>
                <MenuItem value={LevelEnum.STUDENT}>学生</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
