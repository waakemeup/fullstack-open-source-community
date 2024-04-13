import React from "react";
import Comment from "../../types/Comment";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import moment from "moment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { message } from "mui-message";
import axios from "../../api";
import useSWR from "swr";

interface Props {
  comment: Comment;
  id: number;
}

const SingleComment: React.FC<Props> = ({ comment, id }) => {
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
            <IconButton aria-label="comment" sx={{ fontSize: "17px" }}>
              <CommentIcon sx={{ fontSize: "17px" }} />
            </IconButton>
            <IconButton aria-label="share" sx={{ fontSize: "17px" }}>
              <MoreVertIcon sx={{ fontSize: "17px" }} />
            </IconButton>
          </Stack>
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
