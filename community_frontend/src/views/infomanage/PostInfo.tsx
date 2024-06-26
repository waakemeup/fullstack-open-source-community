import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import { message } from "mui-message";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import axios from "../../api";
import NoticeEditor from "../../components/editor/NoticeEditor";
import Department from "../../types/Department";
import Notice from "../../types/Notice";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditNoticeModal from "../../components/Modals/EditNoticeModal";

interface Props {}

const PostInfo: React.FC<Props> = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [departmentName, setDepartmentName] = useState<string>("");
  const [flag, setFlag] = useState<boolean>(true);
  const [showEditNoticeModal, setShowEditNoticeModal] =
    useState<boolean>(false);

  const [selectId, setSelectId] = useState<number>();

  const fromRef = useRef<HTMLFormElement>(null);

  const { data: departments, mutate: departments_mutate } = useSWR<
    Department[]
  >("department/find/all", {
    suspense: true,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
  });

  const { data: notices, mutate: notices_mutate } = useSWR<Notice[]>(
    "notice/all",
    {
      suspense: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );

  const handleNameChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    console.log(newValue);
    setDepartmentName(newValue as string);
  };

  return (
    <Box sx={{ overflowX: "hidden", maxWidth: "95%" }}>
      <EditNoticeModal
        id={selectId}
        open={showEditNoticeModal}
        mutate={notices_mutate}
        handleClose={() => setShowEditNoticeModal(!showEditNoticeModal)}
      />
      <Button sx={{ marginBottom: "1rem" }}>发布公告</Button>
      <form
        ref={fromRef}
        style={{
          maxWidth: "100%",
        }}
        onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
            const res = await axios.post("notice/create", {
              title,
              body,
              department: departmentName,
            });
            console.log(res.status);
            if (res.status === 201) {
              message.success("发布成功");
            }
            await notices_mutate();
            setTitle("");
            setDepartmentName("");
            setFlag(!flag);
            setBody("");
          } catch (error: any) {
            message.error(error.message || "发布失败");
          }
        }}
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>标题</FormLabel>
            <Input
              value={title}
              autoFocus
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ minHeight: "301px" }}>
            <FormLabel>公告内容</FormLabel>
            <NoticeEditor
              setCurHtml={(value: string) => setBody(value)}
              flag={flag}
            />
          </FormControl>
          <FormControl>
            <FormLabel>选择社团</FormLabel>
            <Select onChange={handleNameChange} value={departmentName}>
              {departments?.map((department) => {
                return (
                  <Option key={department.id} value={department.name}>
                    {department.name}
                  </Option>
                );
              })}
            </Select>
          </FormControl>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row-reverse" },
            }}
          >
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              color="neutral"
              onClick={() => {
                setFlag(!flag);
                setBody("");
                handleNameChange(null, "");
                setTitle("");
              }}
            >
              Clear
            </Button>
          </Box>
        </Stack>
      </form>
      <Button sx={{ marginY: "1rem" }}>所有公告</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="right">公告标题</TableCell>
              <TableCell align="right">公告发布者</TableCell>
              <TableCell align="right">社团名</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notices?.map((notice) => (
              <TableRow
                key={notice.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {notice.id}
                </TableCell>
                <TableCell align="right">{notice.title}</TableCell>
                <TableCell align="right">{notice.publisher.username}</TableCell>
                <TableCell align="right">{notice.department.name}</TableCell>
                <TableCell align="right">
                  <Button
                    color="success"
                    onClick={() => {
                      setSelectId(notice.id);
                      setShowEditNoticeModal(!showEditNoticeModal);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    color="danger"
                    onClick={async () => {
                      try {
                        await axios.delete(`notice/delete/${notice.id}`);
                        await notices_mutate();
                        message.success("删除成功");
                      } catch (error) {
                        message.error("删除失败");
                      }
                    }}
                  >
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PostInfo;
