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
  Stack,
} from "@mui/joy";
import { message } from "mui-message";
import React, { useState } from "react";
import axios from "../../api";

interface Props {
  open: boolean;
  handleClose: () => void;
  id: number | null | undefined; //contest_id
  mutate: () => void;
}

const CreateGroupModal: React.FC<Props> = ({
  open,
  handleClose,
  id,
  mutate,
}) => {
  const [name, setName] = useState<string>("");

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog sx={{ overflow: "hidden", overflowY: "scroll" }}>
          <DialogTitle>创建</DialogTitle>
          <DialogContent>创建队伍</DialogContent>
          <form
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              try {
                const res = await axios.post(`group/${id}`, {
                  name,
                });
                message.success("创建成功");
                await mutate();
                setName("");
                handleClose();
              } catch (error: any) {
                console.log(error);
                message.error(error.message || "创建失败");
              }
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>队伍名称(10个字以内)</FormLabel>
                <Input
                  value={name}
                  autoFocus
                  required
                  onChange={(e) => setName(e.target.value)}
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
                    setName("");
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

export default CreateGroupModal;
