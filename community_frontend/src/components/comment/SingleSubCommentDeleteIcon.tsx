import React from "react";
import Comment from "../../types/Comment";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { message } from "mui-message";
import axios from "../../api";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface Props {
  subComment: Comment;
  fatherMutate: Function;
}

const SingleSubCommentDeleteIcon: React.FC<Props> = ({
  subComment,
  fatherMutate,
}) => {
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl2);
  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <>
      <IconButton
        aria-label="share"
        sx={{ fontSize: "17px" }}
        onClick={handleClick2}
      >
        <MoreVertIcon sx={{ fontSize: "17px" }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl2} //TODO:错在这,这个anchorEl2每次都挂载在最后一个元素上
        open={open2}
        onClose={handleClose2}
        MenuListProps={{
          "aria-labelledby": "basic-button2",
        }}
      >
        <MenuItem
          onClick={async () => {
            try {
              handleClose2();
              await axios.delete(`comment/delete/${subComment.id}`);
              await fatherMutate();
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
  );
};

export default SingleSubCommentDeleteIcon;
