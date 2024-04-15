import {
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material";

import { Avatar, Box, Button, Pagination, Paper } from "@mui/material";
import Carousel from "nuka-carousel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";
import Department from "../../../types/Department";
import "./index.scss";

interface Props {}

const StuMain: React.FC<Props> = () => {
  const { data: departmentsData } = useSWR<Department[]>(
    "department/find/allbystu",
    {
      suspense: true,
    }
  );

  // useEffect(() => {
  //   console.log(departmentsData);
  // });

  const [page, setPage] = useState<number>(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const navigate = useNavigate();

  const [departmentsByPage, setDepartmentsByPage] = useState<Department[]>();

  useEffect(() => {
    console.log(departmentsData);
    setDepartmentsByPage(
      departmentsData?.slice((page - 1) * 12, (page - 1) * 12 + 12)
    );
  }, [page, departmentsData]);

  return (
    <>
      <Box flex="col" alignItems={"center"}>
        <Carousel
          renderCenterLeftControls={({ previousSlide }) => (
            <>
              <KeyboardArrowLeftRounded onClick={previousSlide} />
            </>
          )}
          renderCenterRightControls={({ nextSlide }) => (
            <>
              <KeyboardArrowRightRounded onClick={nextSlide} />
            </>
          )}
          style={{
            width: "100vw",
            height: "auto",
            maxHeight: "50vh",
            overflow: "hidden",
            objectFit: "cover",
            objectPosition: "50% 50%",
          }}
        >
          <img
            src={
              "https://img1.baidu.com/it/u=4147026162,949514276&fm=253&fmt=auto&app=138&f=JPEG?w=708&h=500"
            }
          />
          <img
            src={
              "https://img1.baidu.com/it/u=2016101169,287943697&fm=253&fmt=auto&app=138&f=PNG?w=410&h=335"
            }
          />
          <img
            src={
              "https://img1.baidu.com/it/u=4158968887,1436193885&fm=253&fmt=auto&app=138&f=JPG?w=500&h=281"
            }
          />
        </Carousel>
        <Box
          display="flex"
          flexDirection={"row"}
          flexGrow={"1"}
          alignItems={"center"}
          justifyContent={"space-around"}
          sx={{
            marginTop: "2rem",
          }}
        >
          <Paper>
            <Box sx={{ padding: 3 }}>
              {/* <div>123</div> */}
              <Button variant="contained" sx={{ borderRadius: 100 }}>
                社团资讯
              </Button>
              {
                // TODO:社团资讯map
              }
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Box
                  display="flex"
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <div style={{ paddingRight: "3rem" }}>社团资讯内容</div>
                  <div>时间</div>
                </Box>
                <Box
                  display="flex"
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <div style={{ paddingRight: "3rem" }}>社团资讯内容</div>
                  <div>时间</div>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper>
            <Box sx={{ padding: 3 }}>
              <Button variant="contained" sx={{ borderRadius: 100 }}>
                社团比赛
              </Button>
              {
                // TODO:社团比赛map
              }
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Box
                  display="flex"
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <div style={{ paddingRight: "3rem" }}>社团资讯内容</div>
                  <div>时间</div>
                </Box>
                <Box
                  display="flex"
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <div style={{ paddingRight: "3rem" }}>社团资讯内容</div>
                  <div>时间</div>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ margin: "1.5rem" }}>
          <Button variant="contained" sx={{ borderRadius: 100 }}>
            优秀社团
          </Button>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            flexWrap={"wrap"}
          >
            {departmentsByPage?.map((department) => (
              <Box
                sx={{ padding: "1rem" }}
                display="flex"
                alignItems={"center"}
                flexDirection={"column"}
                justifyContent={"center"}
                key={department.id}
                onClick={() => navigate(`/stu/department/${department.id}`)}
              >
                <Avatar
                  sx={{ width: "9rem", height: "9rem" }}
                  src={department.imgUrl}
                  alt={department.name}
                >
                  {department.name}
                </Avatar>
                <div
                  style={{
                    marginTop: 2,
                    width: "9rem",
                    whiteSpace: "wrap",
                    // textOverflow: "",
                    overflow: "hidden",
                    display: "inline-block",
                    wordBreak: "break-word",
                  }}
                >
                  {department.name + "社"}
                </div>
              </Box>
            ))}
          </Box>
          <Pagination
            count={Math.ceil((departmentsData?.length as number) / 12)}
            page={page}
            onChange={handleChange}
            variant="outlined"
            color="primary"
            sx={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default StuMain;
