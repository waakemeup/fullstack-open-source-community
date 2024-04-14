import { Box, Input, Modal, ModalDialog, Typography } from "@mui/joy";
import React, { memo } from "react";

interface Props {
  id?: number;
  open: boolean;
  name: string;
  title: string;
  description: string;
  handleClose: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ShowDepartment: React.FC<Props> = ({
  open,
  name,
  title,
  description,
  handleClose,
}) => {
  return (
    <Modal open={open} onClose={() => handleClose()}>
      <ModalDialog sx={{ overflowY: "scroll", maxWidth: "70vw" }}>
        <Box
          flex="col"
          sx={{
            // maxWidth: "100%",
            maxHeight: "85vh",
            minWidth: "65vw",
            overflowY: "scroll",
          }}
        >
          <h2>name</h2>
          <Input value={name} readOnly />
          <h2>title</h2>
          <Typography component={"span"} variant="soft">
            {title}
          </Typography>
          {/* <Input value={title} readOnly /> */}
          <h2>description</h2>
          {/* <Input value={description} readOnly /> */}
          <Typography component={"span"} variant="soft">
            <div
              dangerouslySetInnerHTML={{
                __html: description as string,
              }}
            />
          </Typography>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default memo(ShowDepartment);
