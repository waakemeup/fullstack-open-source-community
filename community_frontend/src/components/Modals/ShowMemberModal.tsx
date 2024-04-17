import { DialogContent, DialogTitle, Modal, ModalDialog } from "@mui/joy";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useContext } from "react";
import useSWR from "swr";
import Group from "../../types/Group";
import { UserStoreContext } from "../../store/UserStore";
import { message } from "mui-message";
import axios from "../../api";

interface Props {
  open: boolean;
  handleClose: () => void;
  id: number | null | undefined; //group_id
  mutate: () => void;
}

const ShowMemberModal: React.FC<Props> = ({
  open,
  handleClose,
  id,
  mutate,
}) => {
  const { data: group, mutate: group_mutate } = useSWR<Group>(
    id !== undefined ? `group/${id}` : "",
    {
      suspense: true,
    }
  );

  const userStore = useContext(UserStoreContext);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog sx={{ overflow: "hidden", overflowY: "scroll" }}>
          <DialogTitle>查看</DialogTitle>
          <DialogContent>查看队伍人员</DialogContent>
          <TableContainer>
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
                {group?.users?.map((user) => {
                  return (
                    <TableRow
                      key={user.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {user.id}
                      </TableCell>
                      <TableCell align="right">{user.name}</TableCell>
                      <TableCell align="right">{user.username}</TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="right">
                        {group.creator.id === userStore.user?.id &&
                        user.id !== userStore.user.id ? (
                          <Button
                            variant="outlined"
                            onClick={async () => {
                              try {
                                await axios.post("group/remove", {
                                  groupId: id,
                                  userId: user.id,
                                });
                                await mutate();
                                await group_mutate();
                                message.info("移除成功");
                              } catch (error) {
                                message.error("移除失败");
                              }
                            }}
                          >
                            移除
                          </Button>
                        ) : (
                          <>无</>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default ShowMemberModal;
