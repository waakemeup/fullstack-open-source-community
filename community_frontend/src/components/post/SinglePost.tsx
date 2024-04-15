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
  Menu,
  MenuItem,
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
// import "prismjs/themes/prism.css";
// import "prism-themes/themes/prism-laserwave.css";
import "../../prism-laserwave.css";

// import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/autoloader/prism-autoloader";
import { UserStoreContext } from "../../store/UserStore";
import RoleEnum from "../../types/enums/RoleEnum";
import LevelEnum from "../../types/enums/LevelEnum";
import PostTypeEnum from "../../types/enums/PostTypeEnum";
import SinglePostModal from "../Modals/SinglePostModal";
import useSWR from "swr";
import axios from "../../api";
import { message } from "mui-message";
import Comment from "../../types/Comment";

interface Props {
  post: Post;
  id: number;
  postMutate: Function;
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

const SinglePost: React.FC<Props> = ({ post, id, postMutate }) => {
  Prism.plugins.autoloader.languages_path =
    "../../../node_modules/prismjs/components/";
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const userStore = useContext(UserStoreContext);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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

  const { data: allMainComments, mutate: main_comments_mutate } = useSWR<
    Comment[]
  >(`comment/main/${id}`, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    suspense: true,
  });

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ maxWidth: "100%", maxHeight: "300px" }}>
      <SinglePostModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        id={post.id}
      />
      <CardHeader
        sx={{ paddingBottom: "1px" }}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {post.user.username}
          </Avatar>
        }
        action={
          <>
            <IconButton aria-label="settings" onClick={handleClick}>
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
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={async () => {
                  try {
                    handleClose();
                    await axios.delete(`post/delete/${id}`);
                    await postMutate();
                    message.info("删除成功");
                  } catch (error: any) {
                    message.error(error.response.data.message);
                  }
                }}
              >
                删除
              </MenuItem>
            </Menu>
          </>
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
          onClick={() => setModalOpen(!modalOpen)}
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
          onClick={() => setModalOpen(!modalOpen)}
        >
          <CommentIcon />
          {allMainComments?.length === 0 ? null : allMainComments?.length}
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={() => setModalOpen(!modalOpen)}
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
