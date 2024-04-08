import {
  Avatar,
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
import axios from "../../../api";
import useSWR from "swr";
import Department from "../../../types/Department";
import moment from "moment";
import { useNavigate } from "react-router";

interface Props {}

const PostDepartment: React.FC<Props> = () => {
  const navigate = useNavigate();

  const { data: applyingDepartments, mutate: apply_mutate } = useSWR<
    Department[]
  >("user/applyingdepartments", {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    suspense: true,
  });

  const { data: joinedDepartments, mutate: join_mutate } = useSWR<Department[]>(
    "user/joineddepartments",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  useEffect(() => {
    console.log(applyingDepartments);
    console.log(joinedDepartments);
  }, [applyingDepartments, joinedDepartments]);

  return (
    <>
      <Box>
        <Button variant="contained">正在申请中的社团:</Button>
        <TableContainer sx={{ marginBottom: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>社团id</TableCell>
                <TableCell align="left">社团logo</TableCell>
                <TableCell align="right">社团名</TableCell>
                <TableCell align="right">社长</TableCell>
                <TableCell align="right">社团简介</TableCell>
                <TableCell align="right">社团创建时间</TableCell>
                <TableCell align="right">社团人数</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applyingDepartments?.map((department) => (
                <TableRow
                  key={department.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {department.id}
                  </TableCell>
                  <TableCell align="left">
                    <Avatar src={department.imgUrl}>{department.name}</Avatar>
                  </TableCell>
                  <TableCell align="right">{department.name}</TableCell>
                  <TableCell align="right">
                    {department?.owner?.name || "暂无"}
                  </TableCell>
                  <TableCell align="right">{department.title}</TableCell>
                  <TableCell align="right">
                    {moment(department.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell align="right">{department.users.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button variant="contained">加入的社团:</Button>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table2">
            <TableHead>
              <TableRow>
                <TableCell>社团id</TableCell>
                <TableCell align="left">社团logo</TableCell>
                <TableCell align="right">社团名</TableCell>
                <TableCell align="right">社长</TableCell>
                <TableCell align="right">社团简介</TableCell>
                <TableCell align="right">社团创建时间</TableCell>
                <TableCell align="right">社团人数</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {joinedDepartments?.map((department) => (
                <TableRow
                  key={department.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {department.id}
                  </TableCell>
                  <TableCell align="left">
                    <Avatar src={department.imgUrl}>{department.name}</Avatar>
                  </TableCell>
                  <TableCell align="right">{department.name}</TableCell>
                  <TableCell align="right">{`${department.owner.name} (${department.owner.username})`}</TableCell>
                  <TableCell align="right">{department.title}</TableCell>
                  <TableCell align="right">
                    {moment(department.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell align="right">{department.users.length}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() =>
                        navigate(`/stu/department/main/${department.id}`)
                      }
                    >
                      进入社团主页
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

export default PostDepartment;
