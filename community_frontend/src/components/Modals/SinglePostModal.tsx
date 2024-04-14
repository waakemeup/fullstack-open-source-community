import { DialogContent, DialogTitle, Modal, ModalDialog } from "@mui/joy";
import React, { useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Post from "../../types/Post";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fade,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { UserStoreContext } from "../../store/UserStore";
import RoleEnum from "../../types/enums/RoleEnum";
import LevelEnum from "../../types/enums/LevelEnum";
import PostTypeEnum from "../../types/enums/PostTypeEnum";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommentIcon from "@mui/icons-material/Comment";
import moment from "moment";
import Prism from "prismjs";
// import "prismjs/themes/prism.css";
import "prismjs/plugins/autoloader/prism-autoloader";
// import "prism-themes/themes/prism-laserwave.css";
import "../../prism-laserwave.css";
import CommentEditor from "../editor/CommentEditor";
import { message } from "mui-message";
import axios from "../../api";
import Comment from "../../types/Comment";
import SingleComment from "../comment/SingleComment";
import { User } from "../../types/User";

interface Props {
  open: boolean;
  handleClose: () => void;
  id: number;
}

// TODO:

const SinglePostModal: React.FC<Props> = ({ open, handleClose, id }) => {
  const [commentBody, setCommentBody] = useState<string>();
  // 评论完毕?
  const [commentOk, setCommentOk] = useState<boolean>(false);
  const [placeHolder, setPlaceHolder] = useState<string>();
  const [replyTo, setReplyTo] = useState<User>();
  const [replyCommentId, setReplyCommentId] = useState<number>();
  const [childFlag, setChildFlag] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(1); //留言分页

  Prism.plugins.autoloader.languages_path =
    "../../../node_modules/prismjs/components/";
  const userStore = useContext(UserStoreContext);

  const { data: post, mutate: post_mutate } = useSWR<Post>(
    id !== undefined ? `post/${id}` : "",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  const { data: likeLength, mutate: like_length_mutate } = useSWR<number>(
    `like/length/${id}`,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  const { data: likeByCurrentUser, mutate: like_by_nowuser_mutate } =
    useSWR<boolean>(`like/likebycurrentuser/${id}`, {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    });

  const { data: mainComments, mutate: main_comments_mutate } = useSWR<
    Comment[]
  >(`comment/main/${id}`, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    suspense: true,
  });
  // console.log(post);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [commentsByPage, setCommentsByPage] = useState<Comment[]>();

  useEffect(() => {
    setCommentsByPage(
      mainComments?.slice((page - 1) * 10, (page - 1) * 10 + 10)
    );
  }, [page, mainComments]);

  useEffect(() => {
    Prism.highlightAll();
  }, [post]);

  const scrollToRef = () => {
    if (ref && ref.current) {
      const { top, height } = ref.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollY = top + scrollTop - window.innerHeight / 2 + height / 2;
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // const { data: allSubComments, mutate: sub_comments_mutate } = useSWR<
  //   Comment[]
  // >(replyCommentId !== undefined ? `comment/allsub/${replyCommentId}` : "", {
  //   revalidateIfStale: true,
  //   revalidateOnFocus: true,
  //   revalidateOnMount: true,
  //   revalidateOnReconnect: true,
  //   suspense: true,
  // });

  return (
    <Modal open={open} onClose={handleClose}>
      <Fade
        onEntered={() => {
          Prism.highlightAll();
          setPlaceHolder(undefined);
        }}
        in={open}
      >
        <ModalDialog sx={{ overflowY: "scroll", maxWidth: "70vw" }}>
          <Box>
            <Card
              sx={{
                // maxWidth: "100%",
                maxHeight: "85vh",
                minWidth: "65vw",
                overflowY: "scroll",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  position: "fixed",
                  width: "93%",
                }}
              >
                <CardHeader
                  sx={{
                    paddingBottom: "1px",
                    // position: "fixed",
                    // backgroundColor: "white",
                  }}
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      {post?.user.username}
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      {(userStore.user?.role === RoleEnum.ADMIN ||
                        userStore.user?.level === LevelEnum.HEADER) &&
                        post?.type === PostTypeEnum.DISCUSS && (
                          <div style={{ fontSize: "1rem", color: "salmon" }}>
                            讨论
                          </div>
                        )}
                      {(userStore.user?.role === RoleEnum.ADMIN ||
                        userStore.user?.level === LevelEnum.HEADER) &&
                        post?.type === PostTypeEnum.HELP && (
                          <div
                            style={{ fontSize: "1rem", color: "greenyellow" }}
                          >
                            求助
                          </div>
                        )}
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    post?.user.username +
                    " 发布于:" +
                    moment(post?.createdAt).format("YYYY年 MM月DD日")
                  }
                  subheader={
                    "最近更新:" +
                    moment(post?.updatedAt).format("MM-DD h:mm:ss a")
                  }
                />
              </Box>
              <div style={{ height: "57px" }} />
              <CardContent sx={{ paddingY: "5px" }}>
                <Typography variant="h6" color="ButtonText">
                  {post?.title}
                </Typography>
                <Typography
                  variant="body2"
                  component={"span"}
                  color="WindowText"
                  // sx={{ maxHeight: "200px" }}
                  sx={{
                    marginBottom: "5px",
                    paddingBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "0.5rem",
                      // overflowY: "scroll",
                      // textOverflow: "ellipsis",
                      // whiteSpace: "wrap",
                      // display: "-webkit-box",
                      // WebkitLineClamp: 5, // 控制显示的行数
                      // WebkitBoxOrient: "vertical",
                      // wordWrap: "break-word",
                      paddingBottom: "5px",
                      lineHeight: "1.5",
                    }}
                    dangerouslySetInnerHTML={{ __html: post?.body as string }}
                  ></div>
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton
                  aria-label="add to favorites"
                  onClick={async () => {
                    try {
                      await axios.post(`like/post/${id}`);
                      await like_length_mutate();
                      await like_by_nowuser_mutate();
                    } catch (error: any) {
                      message.error(error.message);
                    }
                  }}
                  color={likeByCurrentUser ? "success" : "default"}
                >
                  <FavoriteIcon />
                  {likeLength === 0 ? null : likeLength}
                </IconButton>
                <IconButton
                  aria-label="comment"
                  onClick={() => setPlaceHolder(undefined)}
                >
                  <CommentIcon />
                  {mainComments?.length === 0 ? null : mainComments?.length}
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                {/* <ExpandMore aria-label="show more" color="info">
                <ExpandMoreIcon />
              </ExpandMore> */}
              </CardActions>
            </Card>
          </Box>
          <Paper
            sx={{
              backgroundColor: "#cecece",
            }}
          >
            <Box sx={{ margin: "5px" }}>
              <CommentEditor
                setCurHtml={(value: string) => setCommentBody(value)}
                commentOk={commentOk}
                ref={ref}
                placeHolder={placeHolder}
              />
              <Grid
                container
                direction={"row-reverse"}
                sx={{ marginTop: "2px" }}
              >
                <div />
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "green" }}
                  onClick={async () => {
                    try {
                      if (placeHolder === undefined) {
                        await axios.post(`comment/topost/${post?.id}`, {
                          body: commentBody,
                        });
                        await main_comments_mutate();
                        message.success("评论成功");
                        setCommentOk(true);
                        setTimeout(() => {
                          setCommentOk(false);
                        }, 500);
                      } else {
                        // 回复某个人
                        console.log(replyTo, replyCommentId);
                        await axios.post(
                          `comment/tocomment/${replyCommentId}`,
                          {
                            body: commentBody,
                            user: replyTo,
                          }
                        );
                        await main_comments_mutate();
                        message.success("评论成功");
                        setCommentOk(true);
                        setChildFlag(!childFlag);
                        setTimeout(() => {
                          setCommentOk(false);
                        }, 500);
                      }
                    } catch (error: any) {
                      if (commentBody === "<p><br></p>") {
                        message.error("评论不可为空");
                      } else {
                        message.error(error.message);
                      }
                      // console.log(error);
                    }
                  }}
                >
                  评论
                </Button>
              </Grid>
            </Box>
          </Paper>
          {/* TODO:全部评论 */}
          <Stack direction={"column"} spacing={1}>
            <Box
              sx={{
                fontWeight: "bold",
              }}
            >{`全部评论${
              mainComments?.length === 0 ? "" : "(" + mainComments?.length + ")"
            }`}</Box>
            {commentsByPage?.map((comment) => (
              <Box key={comment.id}>
                <SingleComment
                  comment={comment}
                  id={comment.id}
                  scrollRefToCenter={scrollToRef}
                  setReplyUsername={() => {
                    setPlaceHolder("回复" + comment.user.username);
                    console.log(comment.user.username);
                  }}
                  setReplyTo={(user) => setReplyTo(user)}
                  setReplyCommentId={(commentId) =>
                    setReplyCommentId(commentId)
                  }
                  flag={childFlag}
                  changeFatherFlag={() => setChildFlag(!childFlag)}
                  setSubCommentPlaceHolder={(value: string) =>
                    setPlaceHolder(value)
                  }
                />
              </Box>
            ))}
            <Pagination
              count={Math.ceil((mainComments?.length as number) / 10)}
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
            {/* <Button onClick={() => scrollToRef()}>test</Button> */}
          </Stack>
        </ModalDialog>
      </Fade>
    </Modal>
  );
};

export default SinglePostModal;
