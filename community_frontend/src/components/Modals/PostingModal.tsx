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
import React, { useState } from "react";
import PostEditor from "../editor/PostEditor";
import PostTypeEnum from "../../types/enums/PostTypeEnum";
import axios from "../../api";
import { message } from "mui-message";

interface Props {
  departmentName: string;
  open: boolean;
  handleClose: () => void;
  mutate: () => void;
}

const PostingModal: React.FC<Props> = ({
  departmentName,
  open,
  handleClose,
  mutate,
}) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [type, setType] = useState<PostTypeEnum>(PostTypeEnum.DISCUSS);

  const handleTypeChange = (
    event: React.SyntheticEvent | null,
    newValue: PostTypeEnum | null
  ) => {
    console.log(newValue);
    setType(newValue as PostTypeEnum);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog sx={{ overflow: "hidden", overflowY: "scroll" }}>
          <DialogTitle>创建</DialogTitle>
          <DialogContent>创建帖子</DialogContent>
          <form
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              try {
                const res = await axios.post("post/create", {
                  title,
                  body,
                  department: departmentName,
                  type,
                });
                mutate();
                console.log(res.status);
                if (res.status === 201) {
                  message.success("发帖成功");
                  handleClose();
                }
              } catch (error: any) {
                message.error(error.message || "Something went wrong");
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
                <FormLabel>社团描述</FormLabel>
                <PostEditor setCurHtml={(value: string) => setBody(value)} />
              </FormControl>
              <FormControl>
                <FormLabel>帖子类型</FormLabel>
                <Select onChange={handleTypeChange}>
                  <Option key={0} value={PostTypeEnum.DISCUSS}>
                    讨论
                  </Option>
                  <Option key={1} value={PostTypeEnum.HELP}>
                    求助
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
                  onClick={() => handleClose()}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default PostingModal;
