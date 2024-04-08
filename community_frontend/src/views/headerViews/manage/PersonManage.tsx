import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import useSWR from "swr";
import axios from "../../../api";
import { User } from "../../../types/User";

interface Props {}

const PersonManage: React.FC<Props> = () => {
  const { data: applyUsers, mutate: apply_mutate } = useSWR<User[]>(
    "department/header/applyusers",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  const { data: users, mutate: getusers_mutate } = useSWR<User[]>(
    "department/header/users",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  useEffect(() => {
    console.log(applyUsers);
    console.log(users);
  }, [applyUsers, users]);

  // console.log(applyUsers);

  return (
    <>
      <Box>
        <Button variant="contained">申请用户表:</Button>
        <TableContainer sx={{ marginBottom: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>用户id</TableCell>
                <TableCell align="right">姓名</TableCell>
                <TableCell align="right">用户名</TableCell>
                <TableCell align="right">邮箱</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applyUsers?.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.id}
                  </TableCell>
                  <TableCell align="right">{user.name}</TableCell>
                  <TableCell align="right">{user.username}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={async () => {
                        await axios.post("department/header/accept", {
                          id: user.id,
                        });
                        await apply_mutate();
                        await getusers_mutate();
                      }}
                    >
                      同意
                    </Button>
                    <Button>拒绝</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* TODO:社团用户名单 */}
        <Button variant="contained">社团用户表:</Button>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table2">
            <TableHead>
              <TableRow>
                <TableCell>用户id</TableCell>
                <TableCell align="right">姓名</TableCell>
                <TableCell align="right">用户名</TableCell>
                <TableCell align="right">邮箱</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.id}
                  </TableCell>
                  <TableCell align="right">{user.name}</TableCell>
                  <TableCell align="right">{user.username}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={async () => {
                        const res = await axios.post(
                          "department/header/removeuser",
                          {
                            id: user.id,
                          }
                        );
                        console.log(res);
                        await getusers_mutate();
                      }}
                      variant="contained"
                      color="warning"
                    >
                      移除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default PersonManage;
