import { Box, Button, IconButton, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import KeyIcon from "@mui/icons-material/Key";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CommentIcon from "@mui/icons-material/Comment";
import FeedIcon from "@mui/icons-material/Feed";

function StuPersonalInfo() {
  const navigate = useNavigate();

  return (
    <Box>
      <Button variant="contained" sx={{ borderRadius: 100, marginBottom: 3 }}>
        个人资料
      </Button>
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        flexWrap={"wrap"}
      >
        {/* item */}
        <Box
          sx={{ padding: "1rem", marginX: "2rem", marginBottom: "2rem" }}
          display="flex"
          alignItems={"center"}
          flexDirection={"column"}
          justifyContent={"center"}
          onClick={() => navigate(`/changepassword`)}
          bgcolor={"Menu"}
          border={3}
          borderColor={"Highlight"}
        >
          <IconButton aria-label="changepassword" size="large">
            <KeyIcon />
          </IconButton>
          <div
            style={{
              marginTop: 2,
              whiteSpace: "wrap",
              // textOverflow: "",
              overflow: "hidden",
              display: "inline-block",
              wordBreak: "break-word",
            }}
          >
            {"修改密码"}
          </div>
        </Box>
        <Box
          sx={{ padding: "1rem", marginX: "2rem", marginBottom: "2rem" }}
          display="flex"
          alignItems={"center"}
          flexDirection={"column"}
          justifyContent={"center"}
          onClick={() => navigate(`myresource`)}
          bgcolor={"Menu"}
          border={3}
          borderColor={"Highlight"}
        >
          <IconButton aria-label="file" size="large">
            <DriveFolderUploadIcon />
          </IconButton>
          <div
            style={{
              marginTop: 2,
              whiteSpace: "wrap",
              // textOverflow: "",
              overflow: "hidden",
              display: "inline-block",
              wordBreak: "break-word",
            }}
          >
            {"我的资源"}
          </div>
        </Box>
        <Box
          sx={{ padding: "1rem", marginX: "2rem", marginBottom: "2rem" }}
          display="flex"
          alignItems={"center"}
          flexDirection={"column"}
          justifyContent={"center"}
          onClick={() => navigate(`mycomments`)}
          bgcolor={"Menu"}
          border={3}
          borderColor={"Highlight"}
        >
          <IconButton aria-label="comment" size="large">
            <CommentIcon />
          </IconButton>
          <div
            style={{
              marginTop: 2,
              whiteSpace: "wrap",
              // textOverflow: "",
              overflow: "hidden",
              display: "inline-block",
              wordBreak: "break-word",
            }}
          >
            {"我的评论"}
          </div>
        </Box>
        <Box
          sx={{ padding: "1rem", marginX: "2rem", marginBottom: "2rem" }}
          display="flex"
          alignItems={"center"}
          flexDirection={"column"}
          justifyContent={"center"}
          onClick={() => navigate(`myposts`)}
          bgcolor={"Menu"}
          border={3}
          borderColor={"Highlight"}
        >
          <IconButton aria-label="post" size="large">
            <FeedIcon />
          </IconButton>
          <div
            style={{
              marginTop: 2,
              whiteSpace: "wrap",
              // textOverflow: "",
              overflow: "hidden",
              display: "inline-block",
              wordBreak: "break-word",
            }}
          >
            {"我的帖子"}
          </div>
        </Box>
      </Box>
    </Box>
  );
}

export default StuPersonalInfo;
