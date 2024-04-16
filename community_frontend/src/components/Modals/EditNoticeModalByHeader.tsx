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
import React, { useContext, useEffect, useState } from "react";
import Notice from "../../types/Notice";
import { message } from "mui-message";
import NoticeEditor from "../editor/NoticeEditor";
import useSWR from "swr";
import Department from "../../types/Department";
import axios from "../../api";
import { UserStoreContext } from "../../store/UserStore";

interface Props {
  open: boolean;
  mutate: () => void;
  handleClose: () => void;
  id: number | undefined;
}

const EditNoticeModalByHeader: React.FC<Props> = ({
  id,
  handleClose,
  mutate,
  open,
}) => {
  const [title, setTitle] = useState<string | undefined>("");
  const [body, setBody] = useState<string | undefined>("");
  const userStore = useContext(UserStoreContext);
  const [flag, setFlag] = useState<boolean>(true);

  const { data: notice, mutate: notice_mutate } = useSWR<Notice>(
    id !== undefined ? `notice/${id}` : "",
    {
      suspense: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    setTitle((notice?.title as string) || "");
    setBody((notice?.body as string) || "");
  }, [notice]);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog sx={{ overflow: "hidden", overflowY: "scroll" }}>
          <DialogTitle>编辑</DialogTitle>
          <DialogContent>编辑公告</DialogContent>
          <form
            style={{
              maxWidth: "100%",
            }}
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              try {
                const res = await axios.put(`notice/update/${id}`, {
                  title,
                  body,
                  department: userStore.user?.ownDepartment?.name,
                });
                await notice_mutate();
                await mutate();
                handleClose();
                message.success("编辑成功");
              } catch (error: any) {
                message.error(error.message || "编辑失败");
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
        </ModalDialog>
      </Modal>
    </>
  );
};

export default EditNoticeModalByHeader;
