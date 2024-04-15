import {
  Box,
  Breadcrumbs,
  Button,
  Fade,
  Grid,
  Link,
  Pagination,
  Paper,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Comment from "../../../types/Comment";
import moment from "moment";
import { message } from "mui-message";
import axios from "../../../api";
import Prism from "prismjs";
import "../../../prism-laserwave.css";
import "prismjs/plugins/autoloader/prism-autoloader";

interface Props {}

const MyComments: React.FC<Props> = () => {
  Prism.plugins.autoloader.languages_path =
    "../../../../node_modules/prismjs/components/";

  const [page, setPage] = useState<number>(1);
  const [commentsByPage, setCommentsByPage] = useState<Comment[]>();
  const { data: myComments, mutate: my_comments_mutate } = useSWR<Comment[]>(
    "comment/user",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    setCommentsByPage(myComments?.slice((page - 1) * 15, (page - 1) * 15 + 15));
  }, [page, myComments]);
  // 15条一页

  return (
    <Box>
      <Button>我的评论</Button>
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
              评论管理
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
                    {"我的评论"}
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
                            {"评论"}
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
                            {"评论时间"}
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
                            {"评论贴标题"}
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
                            {"回复对象"}
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
                  {myComments?.length === 0
                    ? "暂无评论"
                    : commentsByPage?.map((comment) => {
                        return (
                          <Box
                            key={comment.id}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.2)", // 背景颜色，透明度为 0.2
                              backdropFilter: "blur(2px)", // 玻璃滤镜效果，模糊程度为 2px
                              padding: "0.8rem",
                              border: "1px solid skyblue",
                              borderRadius: 2,
                            }}
                          >
                            <Fade
                              onEntered={() => {
                                Prism.highlightAll();
                              }}
                              in={true}
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
                                        dangerouslySetInnerHTML={{
                                          __html: comment.body as string,
                                        }}
                                      />
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
                                    {moment(comment.createdAt).format(
                                      "YYYY-MM-DD"
                                    )}
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
                                    {comment.post.title}
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
                                    {comment.commentUsername || "无"}
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
                                            `comment/delete/${comment.id}`
                                          );
                                          await my_comments_mutate();
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
                            </Fade>
                          </Box>
                        );
                      })}
                  <Pagination
                    count={Math.ceil((myComments?.length as number) / 15)}
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
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default MyComments;
