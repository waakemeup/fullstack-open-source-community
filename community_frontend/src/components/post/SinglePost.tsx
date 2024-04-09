import React, { useContext, useEffect, useState } from "react";
import Post from "../../types/Post";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommentIcon from "@mui/icons-material/Comment";
import moment from "moment";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import { UserStoreContext } from "../../store/UserStore";
import RoleEnum from "../../types/enums/RoleEnum";
import LevelEnum from "../../types/enums/LevelEnum";
import PostTypeEnum from "../../types/enums/PostTypeEnum";

interface Props {
  post: Post;
  id: number;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const SinglePost: React.FC<Props> = ({ post, id }) => {
  const [expanded, setExpanded] = useState(false);

  const userStore = useContext(UserStoreContext);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Card sx={{ maxWidth: "100%", maxHeight: "300px" }}>
      <CardHeader
        sx={{ paddingBottom: "1px" }}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {post.user.username}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            {(userStore.user?.role === RoleEnum.ADMIN ||
              userStore.user?.level === LevelEnum.HEADER) &&
              post.type === PostTypeEnum.DISCUSS && (
                <div style={{ fontSize: "1rem", color: "salmon" }}>讨论</div>
              )}
            {(userStore.user?.role === RoleEnum.ADMIN ||
              userStore.user?.level === LevelEnum.HEADER) &&
              post.type === PostTypeEnum.HELP && (
                <div style={{ fontSize: "1rem", color: "greenyellow" }}>
                  求助
                </div>
              )}
            <MoreVertIcon />
          </IconButton>
        }
        title={
          post.user.username +
          " 发布于:" +
          moment(post.createdAt).format("YYYY年 MM月DD日")
        }
        subheader={
          "最近更新:" + moment(post.updatedAt).format("MM-DD h:mm:ss a")
        }
      />
      <CardContent sx={{ maxHeight: "250px", paddingY: "5px" }}>
        <Typography variant="h6" color="ButtonText">
          {post.title}
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
              maxHeight: "100px",
              marginBottom: "0.5rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "wrap",
              display: "-webkit-box",
              WebkitLineClamp: 5, // 控制显示的行数
              WebkitBoxOrient: "vertical",
              wordWrap: "break-word",
              paddingBottom: "5px",
              lineHeight: "1.5",
            }}
            dangerouslySetInnerHTML={{ __html: post?.body as string }}
          ></div>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="comment">
          <CommentIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          color="info"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
};

export default SinglePost;
