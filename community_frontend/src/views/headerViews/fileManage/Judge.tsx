import React, { useContext } from "react";
import useSWR from "swr";
import { User } from "../../../types/User";
import { UserStoreContext } from "../../../store/UserStore";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Paper,
  Stack,
} from "@mui/material";
import MyFile from "../../../types/MyFile";
import byteSize from "byte-size";
import downloadFile from "../../../utils/downloadFile";
import { message } from "mui-message";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import moment from "moment";
import axios from "../../../api";

interface Props {}

const Judge: React.FC<Props> = () => {
  // console.log(user?.ownDepartment?.id);
  const userStore = useContext(UserStoreContext);

  // const department_id = userStore.user?.ownDepartment?.id;
  // console.log(department_id);
  const { data: files, mutate: files_mutate } = useSWR<MyFile[]>(
    `file/department/header/${userStore.user?.ownDepartment?.id}`,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  return (
    <Paper
      sx={{
        padding: "2rem",
        backgroundColor: "#D9AFD9",
        backgroundImage: "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
        minHeight: "60vh",
      }}
      elevation={12}
    >
      <Box display="flex" flexDirection={"column"} justifyContent={"center"}>
        <Stack spacing={2}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            sx={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            资源审批
          </Box>
          <Box
            sx={{
              // minWidth: "600px",
              backgroundColor: "rgba(255, 255, 255, 0.2)", // 背景颜色，透明度为 0.2
              backdropFilter: "blur(2px)", // 玻璃滤镜效果，模糊程度为 2px
              border: "4px solid rgba(0, 128, 255, 0.5)", // 淡蓝色边框，透明度为 0.5
              transition: "box-shadow 0.3s", // 过渡效果，用于悬停时的阴影变化
              boxShadow: "none", // 初始阴影为无
              "&:hover": {
                boxShadow: "0 0 8px rgba(0, 0, 255, 0.3)", // 悬停时的阴影效果
              },
              padding: "5px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)", // 淡白色，透明度为 0.2
                backdropFilter: "blur(2px)", // 玻璃滤镜效果，模糊程度为 2px
              }}
            >
              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ paddingY: "0.4rem", paddingLeft: "1rem" }}
              >
                <Link underline="hover" color="inherit" href="/app/dashboard">
                  首页
                </Link>
                <Link underline="hover" color="inherit">
                  {"社团: " + userStore.user?.ownDepartment?.name}
                </Link>
                <Link
                  underline="hover"
                  color="text.primary"
                  href=""
                  aria-current="page"
                >
                  {"社团资源"}
                </Link>
              </Breadcrumbs>
            </Box>
            <Box sx={{ marginTop: "0.8rem" }}>
              <Stack direction={"column"} spacing={1}>
                {
                  <Box
                    sx={{
                      paddingX: "0.8rem",
                    }}
                  >
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
                      <Grid item xs={5}>
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {"文件"}
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        sx={{
                          "@media (max-width: 620px)": {
                            display: "none",
                          },
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {"上传时间"}
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        sx={{
                          "@media (max-width: 620px)": {
                            display: "none",
                          },
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {"上传用户"}
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        sx={{
                          "@media (max-width: 620px)": {
                            display: "none",
                          },
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {"大小"}
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{
                          "@media (max-width: 220px)": {
                            display: "none",
                          },
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {"操作"}
                        </div>
                      </Grid>
                    </Grid>
                  </Box>
                }
                {files?.length === 0
                  ? "暂时无文件上传"
                  : files?.map((file) => {
                      const fileSize = byteSize(Number(file.size));

                      return (
                        <Box
                          key={file.id}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)", // 背景颜色，透明度为 0.2
                            backdropFilter: "blur(2px)", // 玻璃滤镜效果，模糊程度为 2px
                            padding: "0.8rem",
                            border: "1px solid skyblue",
                            borderRadius: 2,
                          }}
                        >
                          <Grid
                            container
                            direction={"row"}
                            spacing={2}
                            sx={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            <Grid item xs={5}>
                              <Stack
                                direction={"row"}
                                spacing={1}
                                sx={{
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    color: "black",
                                    textDecoration: "none", // 默认无下划线
                                    transition: "color 0.3s", // 过渡效果
                                    cursor: "pointer",
                                    ":hover": {
                                      color: "green", // 树叶绿色
                                      textDecoration: "underline", // 带下划线
                                    },
                                  }}
                                >
                                  <div
                                    style={{
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                    }}
                                    onClick={async () => {
                                      try {
                                        // const res = await axios.get(
                                        //   `file/${file.id}`
                                        // );
                                        // console.log(res);
                                        await downloadFile(
                                          file.id,
                                          file.originalName,
                                          file.size
                                        );
                                      } catch (error: any) {
                                        message.error(error.message);
                                      }
                                    }}
                                  >
                                    {file.originalName}
                                  </div>
                                </Box>
                                <Box
                                  display="flex"
                                  flexDirection={"column"}
                                  justifyContent={"center"}
                                  sx={{
                                    ":hover": {
                                      color: "green",
                                    },
                                  }}
                                >
                                  <DownloadForOfflineRoundedIcon
                                    sx={{
                                      fontSize: "1.2rem",
                                    }}
                                    onClick={async () => {
                                      try {
                                        // const res = await axios.get(
                                        //   `file/${file.id}`
                                        // );
                                        // console.log(res);
                                        await downloadFile(
                                          file.id,
                                          file.originalName,
                                          file.size
                                        );
                                      } catch (error: any) {
                                        message.error(error.message);
                                      }
                                    }}
                                  />
                                </Box>
                              </Stack>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              sx={{
                                "@media (max-width: 620px)": {
                                  display: "none",
                                },
                              }}
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                {moment(file.createdAt).format(
                                  "YYYY-MM-DD hh:mm:ss"
                                )}
                              </div>
                            </Grid>
                            <Grid
                              item
                              xs={1}
                              sx={{
                                "@media (max-width: 620px)": {
                                  display: "none",
                                },
                              }}
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                {file.user.username}
                              </div>
                            </Grid>
                            <Grid
                              item
                              xs={1}
                              sx={{
                                "@media (max-width: 620px)": {
                                  display: "none",
                                },
                              }}
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                {fileSize.value + fileSize.unit}
                              </div>
                            </Grid>
                            <Grid
                              item
                              xs={2}
                              sx={{
                                "@media (max-width: 320px)": {
                                  display: "none",
                                },
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  // overflow: "scroll",
                                }}
                              >
                                {/* {fileSize.value + fileSize.unit} */}
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  sx={{
                                    height: "1.5rem",
                                  }}
                                  onClick={async () => {
                                    try {
                                      await axios.post(
                                        `file/tosuccess/${file.id}`
                                      );
                                      await files_mutate();
                                    } catch (error: any) {
                                      message.error(error.message);
                                    }
                                  }}
                                >
                                  同意
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
                                  sx={{
                                    height: "1.5rem",
                                  }}
                                  onClick={async () => {
                                    try {
                                      await axios.post(
                                        `file/tofail/${file.id}`
                                      );
                                      await files_mutate();
                                    } catch (error: any) {
                                      message.error(error.message);
                                    }
                                  }}
                                >
                                  拒绝
                                </Button>
                              </div>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default Judge;
