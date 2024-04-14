import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import moment from "moment";
import { message } from "mui-message";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import axios from "../../api";
import Comment from "../../types/Comment";
import { User } from "../../types/User";
import { UserStoreContext } from "../../store/UserStore";
import LikeValueEnum from "../../types/enums/LikeValueEnum";

interface Props {
  comment: Comment;
  id: number;
  scrollRefToCenter: () => void;
  setReplyUsername: () => void;
  setReplyTo: (user: User) => void;
  setReplyCommentId: (commentId: number) => void;
  flag: boolean; //是否是子评论
  changeFatherFlag: () => void; //触发更新
  setSubCommentPlaceHolder: (value: string) => void;
}

const SingleComment: React.FC<Props> = ({
  comment,
  id,
  scrollRefToCenter,
  setReplyUsername,
  setReplyTo,
  setReplyCommentId,
  flag,
  changeFatherFlag,
  setSubCommentPlaceHolder,
}) => {
  const userStore = useContext(UserStoreContext);

  const { data: commentLikeLength, mutate: comment_like_length_mutate } =
    useSWR(`like/comment/length/${id}`, {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    });

  const { data: commentLikeByNowUser, mutate: like_by_nowuser_mutate } = useSWR(
    `like/comment/likebycurrentuser/${id}`,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  const { data: allSubComments, mutate: sub_comments_mutate } = useSWR<
    Comment[]
  >(`comment/allsub/${comment.id}`, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    suspense: true,
  });

  const [subComments, setSubComments] = useState<Comment[]>();

  useEffect(() => {
    const fn = async () => await sub_comments_mutate();
    fn();
    setSubComments(allSubComments);
  }, [allSubComments, flag]);

  return (
    <Box>
      <Stack direction={"column"} spacing={0.2}>
        <Stack direction={"row"} spacing={1}>
          <Avatar sx={{ bgcolor: red[500] }}>{comment.user.username}</Avatar>
          <Stack direction={"column"} spacing={0.1}>
            <Typography sx={{ fontSize: "14px" }}>
              {comment.user.username +
                " 发布于:" +
                moment(comment.createdAt).format("YYYY年MM月DD日")}
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "grey" }}>
              {moment(comment.createdAt).format("h:mm:ss a")}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          component={"span"}
          variant="body1"
          sx={{
            marginBottom: 0,
            paddingBottom: 0,
          }}
        >
          <div
            style={{
              marginLeft: "3rem",
              marginTop: "-13px",
              marginBottom: 0,
              paddingBottom: 0,
            }}
            dangerouslySetInnerHTML={{
              __html: comment?.body as string,
            }}
          />
        </Typography>
        <Box sx={{ marginTop: "-20px !important", paddingTop: 0 }}>
          <Stack direction={"row"} spacing={2}>
            <Box
              sx={{
                width: "1.5rem",
              }}
            />
            <IconButton
              aria-label="like"
              onClick={async () => {
                try {
                  await axios.post(`like/comment/${comment.id}`);
                  await comment_like_length_mutate();
                  await like_by_nowuser_mutate();
                } catch (error: any) {
                  message.error(error.message);
                }
              }}
              color={commentLikeByNowUser ? "success" : "default"}
              sx={{ fontSize: "17px" }}
            >
              <ThumbUpIcon sx={{ fontSize: "17px" }} />
              {commentLikeLength === 0 ? null : commentLikeLength}
            </IconButton>
            <IconButton
              aria-label="comment"
              sx={{ fontSize: "17px" }}
              onClick={() => {
                scrollRefToCenter();
                setReplyUsername();
                setReplyTo(comment.user);
                setReplyCommentId(comment.id);
              }}
            >
              <CommentIcon sx={{ fontSize: "17px" }} />
            </IconButton>
            <IconButton aria-label="share" sx={{ fontSize: "17px" }}>
              <MoreVertIcon sx={{ fontSize: "17px" }} />
            </IconButton>
          </Stack>
        </Box>
        {/* TODO:sub comment ui*/}
        <Box sx={{ paddingLeft: "2.6rem" }}>
          <Paper elevation={10} sx={{ backgroundColor: "darkgrey" }}>
            {subComments?.length !== 0 &&
              subComments?.map((subComment) => {
                return (
                  <Stack key={subComment.id} direction={"column"} spacing={0.2}>
                    <Stack direction={"row"} spacing={1}>
                      <Avatar sx={{ bgcolor: red[500] }}>
                        {subComment.user.username}
                      </Avatar>
                      <Stack direction={"column"} spacing={0.1}>
                        <Typography sx={{ fontSize: "14px" }}>
                          {
                            subComment.user.username +
                              " 回复 " +
                              subComment.commentUsername
                            // moment(subComment.createdAt).format(
                            //   "YYYY年MM月DD日"
                            // )
                          }
                        </Typography>
                        <Typography sx={{ fontSize: "13px", color: "grey" }}>
                          {moment(subComment.createdAt).format("h:mm:ss a")}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography
                      component={"span"}
                      variant="body1"
                      sx={{
                        marginBottom: 0,
                        paddingBottom: 0,
                      }}
                    >
                      <div
                        style={{
                          marginLeft: "3rem",
                          marginTop: "-13px",
                          marginBottom: 0,
                          paddingBottom: 0,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: subComment?.body as string,
                        }}
                      />
                    </Typography>
                    <Box sx={{ marginTop: "-20px !important", paddingTop: 0 }}>
                      <Stack direction={"row"} spacing={2}>
                        <Box
                          sx={{
                            width: "1.5rem",
                          }}
                        />
                        <IconButton
                          aria-label="like"
                          onClick={async () => {
                            try {
                              await axios.post(`like/comment/${subComment.id}`);
                              changeFatherFlag();
                              // await comment_like_length_mutate();
                              // await like_by_nowuser_mutate();
                            } catch (error: any) {
                              message.error(error.message);
                            }
                          }}
                          color={
                            subComment.likes.some(
                              (like) =>
                                like.likeUserId === userStore.user?.id &&
                                like.value === LikeValueEnum.LIKE
                            )
                              ? "success"
                              : "default"
                          }
                          sx={{ fontSize: "17px" }}
                        >
                          <ThumbUpIcon sx={{ fontSize: "17px" }} />
                          {subComment.likes.reduce(
                            (sum, like) => sum + like.value,
                            0
                          ) === 0
                            ? null
                            : subComment.likes.reduce(
                                (sum, like) => sum + like.value,
                                0
                              )}
                        </IconButton>
                        {/* TODO:"回复" + comment.user.username */}
                        <IconButton
                          aria-label="comment"
                          sx={{ fontSize: "17px" }}
                          onClick={() => {
                            scrollRefToCenter();
                            setReplyUsername();
                            setReplyTo(subComment.user);
                            setReplyCommentId(subComment.id);
                            setSubCommentPlaceHolder(
                              "回复" + subComment.user.username
                            );
                          }}
                        >
                          <CommentIcon sx={{ fontSize: "17px" }} />
                        </IconButton>
                        <IconButton
                          aria-label="share"
                          sx={{ fontSize: "17px" }}
                        >
                          <MoreVertIcon sx={{ fontSize: "17px" }} />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Stack>
                );
              })}
          </Paper>
        </Box>
      </Stack>
      <Divider
        sx={{
          marginTop: "5px",
        }}
      />
    </Box>
  );
};

export default SingleComment;
