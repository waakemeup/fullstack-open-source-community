import {
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  Pagination,
  Paper,
  Stack,
  useMediaQuery,
} from "@mui/material";
import Carousel from "nuka-carousel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";
import Department from "../../../types/Department";
import "./index.scss";
import Notice from "../../../types/Notice";
import moment from "moment";
import Contest from "../../../types/Contest";

interface Props {}

const StuMain: React.FC<Props> = () => {
  const { data: departmentsData } = useSWR<Department[]>(
    "department/find/allbystu",
    {
      suspense: true,
    }
  );

  const { data: notices } = useSWR<Notice[]>("notice/all", {
    suspense: true,
  });

  const { data: contests } = useSWR<Contest[]>("contest/all", {
    suspense: true,
  });

  // useEffect(() => {
  //   console.log(departmentsData);
  // });

  const [page, setPage] = useState<number>(1);
  const [noticePage, setNoticePage] = useState<number>(1);
  const [contestPage, setContestPage] = useState<number>(1);
  const handleChangeNotice = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setNoticePage(value);
  };

  const handleChangeContest = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setContestPage(value);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const navigate = useNavigate();

  const [departmentsByPage, setDepartmentsByPage] = useState<Department[]>();
  const [noticesByPage, setNoticesByPage] = useState<Notice[]>();
  const [contestsByPage, setContestsByPage] = useState<Contest[]>();

  useEffect(() => {
    // console.log(departmentsData);
    setDepartmentsByPage(
      departmentsData?.slice((page - 1) * 12, (page - 1) * 12 + 12)
    );
    setNoticesByPage(
      notices?.slice((noticePage - 1) * 8, (noticePage - 1) * 8 + 8)
    );
    setContestsByPage(
      contests?.slice((contestPage - 1) * 8, (contestPage - 1) * 8 + 8)
    );
  }, [page, departmentsData, noticePage, notices, contestPage, contests]);

  const isWrap = useMediaQuery("(max-width:900px)");

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
          justifyContent={"center"}
          sx={{
            marginTop: "2rem",
          }}
          flexWrap={isWrap ? "wrap" : "nowrap"}
        >
          <Paper sx={{ minWidth: isWrap ? "70vw" : "45vw", margin: "1rem" }}>
            <Box sx={{ padding: 3 }}>
              <Button
                variant="contained"
                sx={{ borderRadius: 100, marginBottom: "1rem" }}
              >
                社团资讯
              </Button>
              <Stack direction={"column"} spacing={1}>
                <Grid
                  container
                  direction={"row"}
                  spacing={2}
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Grid item xs={3}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {"社团名"}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {"公告标题"}
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {"最近更新时间"}
                    </div>
                  </Grid>
                </Grid>
                {
                  // TODO:社团资讯map
                  noticesByPage?.map((notice) => {
                    return (
                      <Grid
                        key={notice.id}
                        container
                        direction={"row"}
                        spacing={2}
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Grid item xs={3}>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {notice.department.name}
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <Link
                            href={`/stu/notice/${notice.id}`}
                            sx={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              color: "black",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                color: "black",
                                maxWidth: "20vw",
                                cursor: "pointer",
                              }}
                            >
                              {notice.title}
                            </div>
                          </Link>
                        </Grid>
                        <Grid item xs={3}>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {moment(notice.updatedAt).format("YYYY-MM-DD")}
                          </div>
                        </Grid>
                      </Grid>
                    );
                  })
                }
                <Pagination
                  count={Math.ceil((notices?.length as number) / 8)}
                  page={noticePage}
                  onChange={handleChangeNotice}
                  variant="outlined"
                  color="primary"
                  sx={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </Stack>
            </Box>
          </Paper>

          <Paper sx={{ minWidth: isWrap ? "70vw" : "45vw", margin: "1rem" }}>
            <Box sx={{ paddingX: 3, paddingY: 4 }}>
              <Button variant="contained" sx={{ borderRadius: 100 }}>
                社团比赛
              </Button>
              <Stack direction={"column"} spacing={1}>
                <Grid
                  container
                  direction={"row"}
                  spacing={2}
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Grid item xs={3}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {"社团名"}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {"比赛标题"}
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {"最近更新时间"}
                    </div>
                  </Grid>
                </Grid>
                {
                  // TODO:社团比赛map
                  contestsByPage?.map((contest) => {
                    return (
                      <Grid
                        key={contest.id}
                        container
                        direction={"row"}
                        spacing={2}
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Grid item xs={3}>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {contest.department.name}
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <Link
                            href={`/stu/contest/${contest.id}`}
                            sx={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              color: "black",
                              cursor: "pointer",
                              maxWidth: "30vw",
                            }}
                          >
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                color: "black",
                                maxWidth: "20vw",
                                cursor: "pointer",
                              }}
                            >
                              {contest.title}
                            </div>
                          </Link>
                        </Grid>
                        <Grid item xs={3}>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {moment(contest.updatedAt).format("YYYY-MM-DD")}
                          </div>
                        </Grid>
                      </Grid>
                    );
                  })
                }
                <Pagination
                  count={Math.ceil((contests?.length as number) / 8)}
                  page={contestPage}
                  onChange={handleChangeContest}
                  variant="outlined"
                  color="primary"
                  sx={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </Stack>
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
