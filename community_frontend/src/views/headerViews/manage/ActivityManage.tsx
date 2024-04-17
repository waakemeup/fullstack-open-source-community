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
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import axios from "../../../api";
import useSWR from "swr";
import Department from "../../../types/Department";
import Notice from "../../../types/Notice";
import { message } from "mui-message";
import NoticeEditor from "../../../components/editor/NoticeEditor";
import { UserStoreContext } from "../../../store/UserStore";
import EditNoticeModalByHeader from "../../../components/Modals/EditNoticeModalByHeader";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import Contest from "../../../types/Contest";
import EditContestModalByHeader from "../../../components/Modals/EditContestModalByHeader";

interface Props {}

const ActivityManage: React.FC<Props> = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [flag, setFlag] = useState<boolean>(true);
  const [showEditNoticeModal, setShowEditNoticeModal] =
    useState<boolean>(false);

  const [showEditContestModal, setShowEditContestModal] =
    useState<boolean>(false);

  const [selectId, setSelectId] = useState<number>();
  const [selectId2, setSelectId2] = useState<number>();

  const userStore = useContext(UserStoreContext);

  // contest
  const [contestTitle, setContestTitle] = useState<string>("");
  const [contestBody, setContestBody] = useState<string>("");
  const [contestFlag, setContestFlag] = useState<boolean>(true);
  const [endDate, setEndDate] = useState<Moment | null>(moment());
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(1);

  // useEffect(() => {
  //   console.log(endDate?.toDate());
  // }, [endDate]);

  const { data: notices, mutate: notices_mutate } = useSWR<Notice[]>(
    `notice/header/all/${userStore.user?.ownDepartment?.id}`,
    {
      suspense: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );

  const { data: contests, mutate: contests_mutate } = useSWR<Contest[]>(
    `contest/all/${userStore.user?.ownDepartment?.id}`,
    {
      suspense: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );

  return (
    <Box sx={{ overflowX: "hidden", maxWidth: "95%" }}>
      <EditNoticeModalByHeader
        id={selectId}
        open={showEditNoticeModal}
        mutate={notices_mutate}
        handleClose={() => setShowEditNoticeModal(!showEditNoticeModal)}
      />
      <EditContestModalByHeader
        id={selectId2}
        open={showEditContestModal}
        mutate={contests_mutate}
        handleClose={() => setShowEditContestModal(!showEditContestModal)}
      />
      <Button sx={{ marginBottom: "1rem" }}>发布公告</Button>
      <form
        style={{
          maxWidth: "100%",
        }}
        onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
            const res = await axios.post("notice/create", {
              title,
              body,
              department: userStore.user?.ownDepartment!.name,
            });
            console.log(res.status);
            if (res.status === 201) {
              message.success("发布成功");
            }
            await notices_mutate();
            setTitle("");
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
            <Select value={userStore.user?.ownDepartment?.name} disabled>
              <Option
                key={userStore.user?.ownDepartment?.id}
                value={userStore.user?.ownDepartment?.name}
              >
                {userStore.user?.ownDepartment?.name}
              </Option>
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
                <TableCell align="right">
                  {notice.publisher?.username}
                </TableCell>
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
      <Button sx={{ marginY: "1rem" }}>发布比赛</Button>
      <form
        style={{
          maxWidth: "100%",
        }}
        onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
            const res = await axios.post("contest/create", {
              description: contestBody,
              title: contestTitle,
              min,
              max,
              endDate: endDate!.toDate(),
              department: userStore.user?.ownDepartment?.name,
            });
            await contests_mutate();
            message.success("发布成功");
            setContestBody("");
            setContestTitle("");
            setMax(1);
            setMin(1);
            setContestFlag(!contestFlag);
            setEndDate(moment());
          } catch (error: any) {
            console.log(error);
            message.error(error.message || "发布失败");
          }
        }}
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>比赛标题</FormLabel>
            <Input
              value={contestTitle}
              autoFocus
              required
              onChange={(e) => setContestTitle(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ minHeight: "301px" }}>
            <FormLabel>比赛公告</FormLabel>
            <NoticeEditor
              setCurHtml={(value: string) => setContestBody(value)}
              flag={contestFlag}
            />
          </FormControl>
          <FormControl>
            <FormLabel>选择社团</FormLabel>
            <Select value={userStore.user?.ownDepartment?.name} disabled>
              <Option
                key={userStore.user?.ownDepartment?.id}
                value={userStore.user?.ownDepartment?.name}
              >
                {userStore.user?.ownDepartment?.name}
              </Option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>组队截止日期</FormLabel>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDate={moment()}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl>
            <FormLabel>组队最少人数</FormLabel>
            <Input
              type="number"
              value={min}
              error={min < 1}
              onChange={(e) => setMin(Number(e.target.value))}
            />
          </FormControl>
          <FormControl>
            <FormLabel>组队最多人数</FormLabel>
            <Input
              type="number"
              value={max}
              error={max < min}
              onChange={(e) => setMax(Number(e.target.value))}
            />
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
                setContestFlag(!contestFlag);
                setContestBody("");
                setContestTitle("");
                setEndDate(moment());
                setMin(1);
                setMax(1);
              }}
            >
              Clear
            </Button>
          </Box>
        </Stack>
      </form>
      <Button sx={{ marginY: "1rem" }}>所有比赛</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="right">比赛标题</TableCell>
              <TableCell align="right">比赛发布者</TableCell>
              <TableCell align="right">社团名</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contests?.map((contest) => (
              <TableRow
                key={contest.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {contest.id}
                </TableCell>
                <TableCell align="right">{contest.title}</TableCell>
                <TableCell align="right">
                  {contest.publisher?.username}
                </TableCell>
                <TableCell align="right">{contest.department.name}</TableCell>
                <TableCell align="right">
                  <Button
                    color="success"
                    onClick={() => {
                      setSelectId2(contest.id);
                      setShowEditContestModal(!showEditContestModal);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    color="danger"
                    onClick={async () => {
                      try {
                        await axios.delete(`contest/delete/${contest.id}`);
                        await contests_mutate();
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

export default ActivityManage;
