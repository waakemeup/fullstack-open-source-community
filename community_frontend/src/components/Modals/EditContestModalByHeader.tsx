import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import moment, { Moment } from "moment";
import { message } from "mui-message";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { UserStoreContext } from "../../store/UserStore";
import Contest from "../../types/Contest";
import ContestEditor from "../editor/ContestEditor";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "../../api";

interface Props {
  open: boolean;
  mutate: () => void;
  handleClose: () => void;
  id: number | undefined;
}

const EditContestModalByHeader: React.FC<Props> = ({
  id,
  handleClose,
  mutate,
  open,
}) => {
  const [title, setTitle] = useState<string | undefined>("");
  const [body, setBody] = useState<string | undefined>("");
  const userStore = useContext(UserStoreContext);
  const [flag, setFlag] = useState<boolean>(true);
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(1);
  const [endDate, setEndDate] = useState<Moment | null>(moment());

  const { data: contest, mutate: contest_mutate } = useSWR<Contest>(
    id !== undefined ? `contest/${id}` : "",
    {
      suspense: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    setTitle((contest?.title as string) || "");
    setBody((contest?.description as string) || "");
    setMin(contest?.min || 1);
    setMax(contest?.max || 1);
    setEndDate(moment(contest?.endDate) || moment());
  }, [contest]);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog sx={{ overflow: "hidden", overflowY: "scroll" }}>
          <DialogTitle>编辑</DialogTitle>
          <DialogContent>编辑比赛</DialogContent>
          <form
            style={{
              maxWidth: "100%",
            }}
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              try {
                const res = await axios.put(`contest/update/${id}`, {
                  title,
                  description: body,
                  min,
                  max,
                  endDate: endDate?.toDate(),
                  department: userStore.user?.ownDepartment?.name,
                });
                await contest_mutate();
                await mutate();
                handleClose();
                message.success("编辑成功");
              } catch (error: any) {
                console.log(error);
                message.error(error.message || "编辑失败");
              }
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>比赛标题</FormLabel>
                <Input
                  value={title}
                  autoFocus
                  required
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl sx={{ minHeight: "301px" }}>
                <FormLabel>比赛公告</FormLabel>
                <ContestEditor
                  setCurHtml={(value: string) => setBody(value)}
                  flag={flag}
                  id={id}
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
                    setFlag(!flag);
                    setBody("");
                    setTitle("");
                    setMax(1);
                    setMin(1);
                    setEndDate(moment());
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default EditContestModalByHeader;
