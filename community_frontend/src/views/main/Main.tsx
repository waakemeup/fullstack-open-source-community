import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthState } from "../../context/auth";
import { UserStoreContext } from "../../store/UserStore";
import { Box, Pagination, Paper, Stack, Tab, Tabs } from "@mui/material";
import SinglePost from "../../components/post/SinglePost";
import Post from "../../types/Post";
import useSWR from "swr";
import RoleEnum from "../../types/enums/RoleEnum";
import LevelEnum from "../../types/enums/LevelEnum";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Main() {
  const navigate = useNavigate();
  // const { authenticated, user } = useAuthState();
  // useEffect(() => {
  //   if (!authenticated) {
  //     navigate("/login");
  //   }
  // });
  const userStore = useContext(UserStoreContext);
  const user = userStore.user;

  const [pageNumber, setPageNumber] = useState<number>(1);

  const handlePageChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageNumber(value);
    await length_mutate();
    await post_mutate();
  };

  const { data: length, mutate: length_mutate } = useSWR<number>(
    user?.role === RoleEnum.ADMIN
      ? "post/all/admin/posts&length"
      : user?.level === LevelEnum.HEADER
      ? "post/all/header/posts&length"
      : "",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  const { data: posts, mutate: post_mutate } = useSWR<Post[]>(
    user?.role === RoleEnum.ADMIN
      ? `post/all/admin/postspagenumber=${pageNumber}`
      : user?.level === LevelEnum.HEADER
      ? `post/all/header/postspagenumber=${pageNumber}`
      : "",
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      suspense: true,
    }
  );

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper
        sx={{
          padding: "2rem",
        }}
        elevation={12}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="所有帖子" {...a11yProps(0)} />
              {/* <Tab label="求助" {...a11yProps(1)} /> */}
              {/* <Tab label="组队参赛" {...a11yProps(2)} />
              <Tab label="资源分享" {...a11yProps(3)} /> */}
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {/* Item One */}
            <Stack direction={"column"} spacing={2}>
              {posts?.map((post: Post) => {
                return <SinglePost key={post.id} id={post.id} post={post} />;
              })}
            </Stack>
            <Pagination
              sx={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center",
              }}
              count={Math.ceil((length as number) / 5)}
              variant="outlined"
              color="secondary"
              page={pageNumber}
              onChange={handlePageChange}
            />
            {/* TODO:帖子发布,展示,分为求助贴和讨论贴 */}
          </CustomTabPanel>
          {/* <CustomTabPanel value={value} index={1}>
            <Stack direction={"column"} spacing={2}>
              {helpPosts?.map((post: Post) => {
                return <SinglePost key={post.id} id={post.id} post={post} />;
              })}
            </Stack>
            <Pagination
              sx={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center",
              }}
              count={Math.ceil(helpPostsLength / 5)}
              variant="outlined"
              color="secondary"
              page={pageNumber}
              onChange={handlePageChange}
            />
          </CustomTabPanel> */}
        </Box>
      </Paper>
    </>
  );
}

export default Main;
