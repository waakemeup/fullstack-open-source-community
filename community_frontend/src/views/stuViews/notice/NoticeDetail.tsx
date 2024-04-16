import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import Department from "../../../types/Department";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography as Typography2,
} from "@mui/material";
import { Typography } from "../../../layouts/Wrappers/Wrappers";
import moment from "moment";
import Prism from "prismjs";
// import "prismjs/themes/prism.css";
// import "prism-themes/themes/prism-laserwave.css";
import "../../../prism-laserwave.css";

import axios from "../../../api";
import { UserStoreContext } from "../../../store/UserStore";
import Notice from "../../../types/Notice";

interface Props {}

const NoticeDetail: React.FC<Props> = () => {
  const { id } = useParams();

  const userStore = useContext(UserStoreContext);

  const { data: notice } = useSWR<Notice>(`notice/${id}`, {
    suspense: true,
  });

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      // justify="center"
    >
      <Paper
        elevation={4}
        sx={{
          width: "70vw",
          height: "80vh",
          wordBreak: "break-word",
          overflowY: "scroll",
        }}
      >
        <Stack sx={{ marginTop: 3 }} direction={"column"} spacing={1.5}>
          <Stack
            direction={"row"}
            spacing={3}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography variant="h2" component={"h1"}>
              {notice?.department?.name + "社: " + notice?.title}
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            display="flex"
            alignItems={"center"}
            justifyContent={"center"}
            spacing={3}
          >
            <Box>
              发布时间: {moment(notice?.createdAt).format("YYYY-MM-DD")}
            </Box>
            <Box>发布者: {notice?.publisher.name}</Box>
          </Stack>
          <Divider variant="middle" />
          <Box
            display="flex"
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
            flexWrap={"wrap"}
            whiteSpace={"wrap"}
            sx={{
              paddingX: "2rem",
            }}
          >
            <Typography2 component={"span"} variant="body2">
              <div
                dangerouslySetInnerHTML={{
                  __html: notice?.body as string,
                }}
              />
            </Typography2>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default NoticeDetail;
