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
import Post from "../../../types/Post";
import moment from "moment";
import { message } from "mui-message";
import axios from "../../../api";

interface Props {}

const MyPosts: React.FC<Props> = () => {
  const { data: myPosts, mutate: my_posts_mutate } = useSWR<Post[]>(
    "post/all/user",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  return (
    <Box>
      <Button>我的帖子</Button>
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
              帖子管理
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
                    {"我的帖子"}
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
                            {"帖子标题"}
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
                            {"发布时间"}
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
                            {"所在社团"}
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
                            {"留言数"}
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
                  {myPosts?.length === 0
                    ? "暂无评论"
                    : myPosts?.map((post) => {
                        return (
                          <Box
                            key={post.id}
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
                                  <Box>
                                    <div
                                      style={{
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {post.title}
                                    </div>
                                  </Box>
                                </Stack>
                              </Grid>
                              <Grid
                                item
                                xs={2}
                                sx={{
                                  "@media (max-width: 620px)": {
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
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                  }}
                                >
                                  {moment(post.createdAt).format("YYYY-MM-DD")}
                                </div>
                              </Grid>
                              <Grid
                                item
                                xs={2}
                                sx={{
                                  "@media (max-width: 620px)": {
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
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                  }}
                                >
                                  {post.department.name}
                                </div>
                              </Grid>
                              <Grid
                                item
                                xs={1}
                                sx={{
                                  "@media (max-width: 620px)": {
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
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                  }}
                                >
                                  {post.comments.length}
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
                                    color="error"
                                    sx={{
                                      height: "1.5rem",
                                    }}
                                    onClick={async () => {
                                      try {
                                        await axios.delete(
                                          `post/delete/${post.id}`
                                        );
                                        await my_posts_mutate();
                                        message.info("删除成功");
                                      } catch (error: any) {
                                        message.error(error.message);
                                      }
                                    }}
                                  >
                                    删除
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
    </Box>
  );
};

export default MyPosts;
