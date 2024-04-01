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
import React, { useEffect, useState } from "react";
import axios from "../../api";
import useSWR from "swr";
import { message } from "mui-message";
import Department from "../../types/Department";

interface Props {
  open: boolean;
  title: string;
  description: string;
  name: string;
  id: number;
  handleClose: () => void;
  onDataUpdate: (updatedRows: any) => void;
  // parentMutate: Function;
}

const fetcher = async (url: string, data: any) => {
  try {
    const res = await axios.put(url, data);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
};

const EditDepartment: React.FC<Props> = ({
  open,
  handleClose,
  title,
  name,
  description,
  id,
  onDataUpdate,
}) => {
  const [curName, setCurName] = useState<string>(name);
  const [curTitle, setCurTitle] = useState<string>(title);
  const [curDescription, setCurDescription] = useState<string>(description);
  const [curId, setCurId] = useState<number>(id);
  const [isPost, setIsPost] = useState<Boolean>(false);

  useEffect(() => {
    setCurName(name);
    setCurTitle(title);
    setCurDescription(description);
    setCurId(id);
  }, [name, title, description, id]);

  const { data, error, mutate } = useSWR(
    curId ? `department/update/${curId}` : "",
    (url: string) =>
      fetcher(url, {
        name: curName,
        title: curTitle,
        description: curDescription,
      }),
    { suspense: true }
  );

  // @ts-ignore
  const {
    data: departments,
    error: error2,
    mutate: departmentsMutate,
  } = useSWR<Department[]>("department/find/all", {
    suspense: true,
  });

  let updatedRows: any =
    departments?.map((deparment) => {
      return {
        id: deparment.id,
        img: deparment.img,
        owner: deparment.owner.name,
        description: deparment.description,
        title: deparment.title,
        name: deparment.name,
      };
    }) || [];

  useEffect(() => {
    updatedRows =
      departments?.map((deparment) => {
        return {
          id: deparment.id,
          img: deparment.img,
          owner: deparment.owner.name,
          description: deparment.description,
          title: deparment.title,
          name: deparment.name,
        };
      }) || [];
    onDataUpdate(updatedRows);
  }, [isPost]);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog>
          <DialogTitle>编辑</DialogTitle>
          <DialogContent>编辑社团信息</DialogContent>
          <form
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setIsPost(true);
              // console.log(curTitle, curName, curDescription, curId);
              await mutate();
              if (error) {
                message.error(error);
              }
              await departmentsMutate();
              updatedRows =
                departments?.map((deparment) => {
                  return {
                    id: deparment.id,
                    img: deparment.img,
                    owner: deparment.owner.name,
                    description: deparment.description,
                    title: deparment.title,
                    name: deparment.name,
                  };
                }) || [];
              console.log("test2:" + updatedRows, departments);
              onDataUpdate(updatedRows);
              handleClose();
              setIsPost(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>社团名称</FormLabel>
                <Input
                  value={curName}
                  autoFocus
                  required
                  onChange={(e) => setCurName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>社团简介</FormLabel>
                <Input
                  required
                  value={curTitle}
                  onChange={(e) => setCurTitle(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>社团描述</FormLabel>
                <Input
                  required
                  value={curDescription}
                  onChange={(e) => setCurDescription(e.target.value)}
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

export default EditDepartment;
