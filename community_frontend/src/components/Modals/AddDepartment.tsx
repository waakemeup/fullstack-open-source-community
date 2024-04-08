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
import React, { useEffect, useState } from "react";
import axios from "../../api";
import useSWR from "swr";
import { message } from "mui-message";
import Department from "../../types/Department";
import { User } from "../../types/User";
import MyEditor from "../editor/MyEditor";

interface Props {
  open: boolean;
  title: string;
  description: string;
  name: string;
  handleClose: () => void;
  onDataUpdate: (updatedRows: any) => void;
  // parentMutate: Function;
}

const fetcher = async (url: string, data: any) => {
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
};

const AddDepartment: React.FC<Props> = ({
  open,
  handleClose,
  title,
  name,
  description,
  // id,
  onDataUpdate,
}) => {
  const [curName, setCurName] = useState<string>(name);
  const [curTitle, setCurTitle] = useState<string>(title);
  const [curDescription, setCurDescription] = useState<string>(description);
  // const [curId, setCurId] = useState<number>(id);
  const [isPost, setIsPost] = useState<Boolean>(false);
  const [headerId, setHeaderId] = useState<number | null>(null);

  useEffect(() => {
    setCurName(name);
    setCurTitle(title);
    setCurDescription(description);
    // setCurId(id);
  }, [name, title, description]);

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
        img: deparment.imgUrl,
        owner: deparment.owner?.name || "",
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
          img: deparment.imgUrl,
          owner: deparment.owner?.name || "",
          description: deparment.description,
          title: deparment.title,
          name: deparment.name,
        };
      }) || [];
    onDataUpdate(updatedRows);
  }, [isPost]);

  const { data: headerData, mutate: aviHeaderMutate } =
    useSWR<User[]>(`user/aviheaders`);

  console.log("headerData:" + headerData);

  const handleHeaderId = (
    event: React.SyntheticEvent | null,
    newValue: number | null
  ) => {
    console.log(newValue);
    setHeaderId(newValue);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog sx={{ overflow: "hidden", overflowY: "scroll" }}>
          <DialogTitle>创建</DialogTitle>
          <DialogContent>创建社团</DialogContent>
          <form
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              try {
                await axios
                  .post("department/create", {
                    name: curName,
                    title: curTitle,
                    description: curDescription,
                    userId: headerId,
                  })
                  .then((res) => {
                    console.log(res.data);
                  });
              } catch (error: any) {
                message.error(error?.message || "创建失败");
              }

              setIsPost(true);
              // console.log(curTitle, curName, curDescription, curId);

              await departmentsMutate();
              updatedRows =
                departments?.map((deparment) => {
                  return {
                    id: deparment.id,
                    img: deparment.imgUrl,
                    owner: deparment.owner?.name || "",
                    description: deparment.description,
                    title: deparment.title,
                    name: deparment.name,
                  };
                }) || [];
              console.log("Addtest2:" + updatedRows, departments);
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
                {/* <Input
                  required
                  value={curDescription}
                  onChange={(e) => setCurDescription(e.target.value)}
                /> */}
                <MyEditor
                  setCurHtml={(value: string) => setCurDescription(value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>选择社长</FormLabel>
                <Select onChange={handleHeaderId}>
                  {headerData?.map((header) => {
                    return (
                      <Option key={header.id} value={header.id}>
                        {header.name}
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

export default AddDepartment;
