import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Paper,
  Stack,
} from "@mui/material";
import React from "react";
import useSWR from "swr";
import Group from "../../../types/Group";
import { message } from "mui-message";
import axios from "../../../api";

interface Props {}

const MyGroups: React.FC<Props> = () => {
  const { data: myGroups, mutate } = useSWR<Group[]>("group/applymygroup", {
    suspense: true,
  });

  console.log(myGroups);

  return (
    <Box>
      <Button>我的组队</Button>
      <Paper
        sx={{
          padding: "2rem",
          backgroundColor: "#f0ecec",
          backgroundImage: "linear-gradient(19deg, #f0ecec 0%, #ebf7f7 100%)",
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
              组队申请管理
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
                  <Link underline="hover" color="inherit" href="/stu/myinfo">
                    个人中心
                  </Link>
                  <Link underline="hover" color="text.primary">
                    {"组队申请"}
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
                        <Grid item xs={2}>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {"队伍名称"}
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
                            {"比赛名称"}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={2}
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
                            {"申请人"}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={2}
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
                            {"社团名"}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={3}
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
                  {myGroups?.map((group) =>
                    group.applyUsers?.map((applyUser, index) => {
                      return (
                        <Box
                          key={index}
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
                            <Grid item xs={2}>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                {group.name}
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
                                {group.contest.title}
                              </div>
                            </Grid>
                            <Grid
                              item
                              xs={2}
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
                                {applyUser.name}
                              </div>
                            </Grid>
                            <Grid
                              item
                              xs={2}
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
                                {group.contest.department.name}
                              </div>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              sx={{
                                "@media (max-width: 220px)": {
                                  display: "none",
                                },
                              }}
                            >
                              <Button
                                color="info"
                                onClick={async () => {
                                  try {
                                    await axios.post("group/accept", {
                                      groupId: group.id,
                                      userId: applyUser.id,
                                    });
                                    await mutate();
                                    message.info(
                                      `${applyUser.name}已加入${group.name}`
                                    );
                                  } catch (error) {
                                    message.error("同意失败");
                                  }
                                }}
                              >
                                同意
                              </Button>
                              <Button
                                color="warning"
                                onClick={async () => {
                                  try {
                                    await axios.post("group/reject", {
                                      groupId: group.id,
                                      userId: applyUser.id,
                                    });
                                    await mutate();
                                    message.info("已拒绝");
                                  } catch (error) {
                                    message.error("拒绝失败");
                                  }
                                }}
                              >
                                拒绝
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })
                  )}
                </Stack>
              </Box>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              sx={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              我的队伍
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
                  <Link underline="hover" color="inherit" href="/stu/myinfo">
                    个人中心
                  </Link>
                  <Link underline="hover" color="text.primary">
                    我的队伍
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
                        <Grid item xs={2}>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {"队伍名称"}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={4}
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
                            {"比赛名称"}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={2}
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
                            {"队伍人数"}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={2}
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
                            {"社团名"}
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
                  {myGroups?.map((group) => {
                    return (
                      <Box
                        key={group.id}
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
                          <Grid item xs={2}>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {group.name}
                            </div>
                          </Grid>
                          <Grid
                            item
                            xs={4}
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
                              {group.contest.title}
                            </div>
                          </Grid>
                          <Grid
                            item
                            xs={2}
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
                              {group.users.length}
                            </div>
                          </Grid>
                          <Grid
                            item
                            xs={2}
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
                              {group.contest.department.name}
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
                            <Button
                              variant="contained"
                              color="error"
                              onClick={async () => {
                                try {
                                  await axios.delete(`group/${group.id}`);
                                  await mutate();
                                  message.info("删除成功");
                                } catch (error) {
                                  message.error("删除失败");
                                }
                              }}
                            >
                              删除
                            </Button>
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
    </Box>
  );
};

export default MyGroups;
