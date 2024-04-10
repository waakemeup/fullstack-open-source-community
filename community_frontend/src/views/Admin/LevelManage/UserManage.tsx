import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import useSWR from "swr";
import { User } from "../../../types/User";
import axios from "../../../api";
import UserLevelModal from "../../../components/Modals/UserLevelModal";

interface Props {}

const UserManage: React.FC<Props> = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(
    undefined
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { data: users, mutate: users_mutate } = useSWR<User[]>(
    "user/allexceptadmin",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  // console.log(users);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <Paper elevation={12} sx={{ width: "100%", overflow: "scroll" }}>
      <UserLevelModal
        open={showModal}
        handleClose={() => setShowModal(!showModal)}
        id={selectedUserId as number}
        father_mutate={users_mutate}
      />
      <TableContainer sx={{ maxHeight: "80vh" }}>
        <Table stickyHeader aria-label="sticky table">
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
            {users
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((user) => {
                return (
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
                        variant="outlined"
                        onClick={async () => {
                          setShowModal(!showModal);
                          setSelectedUserId(user.id);
                        }}
                      >
                        设置权限
                      </Button>
                      {/* <Button
                        variant="outlined"
                        color="warning"
                        onClick={async () => {}}
                      >
                        删除
                      </Button> */}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={users?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* <div>UserManage</div> */}
    </Paper>
  );
};

export default UserManage;
