import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Modal,
  ModalDialog,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import RoleEnum from "../../types/enums/RoleEnum";
import LevelEnum from "../../types/enums/LevelEnum";
import { User } from "../../types/User";
import axios from "../../api";
import { message } from "mui-message";
import useSWR from "swr";
// import { AxiosError } from "axios";

interface Props {
  open: boolean;
  handleClose: () => void;
  id: number;
  father_mutate: Function;
}

const UserLevelModal: React.FC<Props> = ({
  open,
  handleClose,
  id,
  father_mutate,
}) => {
  // console.log(id);

  const { data: user, mutate } = useSWR<User>(
    id !== undefined ? `user/${id}` : "",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  // console.log(user);
  // console.log("test1:", user?.level, user?.role);
  const [curRole, setCurRole] = useState<RoleEnum | null>(null);
  const [curLevel, setCurLevel] = useState<LevelEnum | null>(null);

  useEffect(() => {
    setCurRole(user?.role as RoleEnum);
    setCurLevel(user?.level as LevelEnum);
  }, [user]);

  // console.log("test2:", curRole, curRole);

  // console.log(user?.role, user?.level);
  // console.log(curRole, curLevel);

  const handleRole = (
    event: React.SyntheticEvent | null,
    newValue: RoleEnum | null
  ) => {
    // console.log("new:" + newValue);
    setCurRole(newValue);
    // console.log(curRole);
  };

  const handleLevel = (
    event: React.SyntheticEvent | null,
    newValue: LevelEnum | null
  ) => {
    // console.log("new:" + newValue);
    setCurLevel(newValue);
    // console.log(curLevel);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog sx={{ overflow: "hidden", overflowY: "scroll" }}>
        <DialogTitle>编辑</DialogTitle>
        <DialogContent>编辑用户信息</DialogContent>
        <form
          onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            try {
              const res = await axios.put(`user/updatebyadmin/${user?.id}`, {
                role: curRole,
                level: curLevel,
              });
              console.log(res);
              if (res.status === 200) message.success("设置成功");
              await mutate();
              await father_mutate();
              handleClose();
            } catch (error: any) {
              message.error(error.message);
              console.log(error);
            }
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>选择权限</FormLabel>
              <Select onChange={handleRole} defaultValue={user?.role}>
                <Option key={RoleEnum.ADMIN} value={RoleEnum.ADMIN}>
                  管理员
                </Option>
                <Option key={RoleEnum.USER} value={RoleEnum.USER}>
                  用户
                </Option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>选择职务</FormLabel>
              <Select onChange={handleLevel} defaultValue={user?.level}>
                <Option key={LevelEnum.HEADER} value={LevelEnum.HEADER}>
                  社长
                </Option>
                <Option key={LevelEnum.STUDENT} value={LevelEnum.STUDENT}>
                  学生
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
  );
};

export default UserLevelModal;
