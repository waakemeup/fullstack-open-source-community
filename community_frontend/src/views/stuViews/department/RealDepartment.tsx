import {
  Box,
  Button,
  Divider,
  Link,
  Pagination,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import PostingModal from "../../../components/Modals/PostingModal";
import SinglePost from "../../../components/post/SinglePost";
import Department from "../../../types/Department";
import Post from "../../../types/Post";
import FileUpload from "../../../components/FileUploader/FileUploader";
import Contest from "../../../types/Contest";
import moment from "moment";
import CreateGroupModal from "../../../components/Modals/CreateGroupModal";

interface Props {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type MyInterface = {
  discussPosts?: Post[];
  helpPosts?: Post[];
  length?: number;
};

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

const RealDepartment: React.FC<Props> = () => {
  const { id } = useParams();

  const { data: department } = useSWR<Department>(`department/stu/find/${id}`, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    suspense: true,
  });

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [helpPageNumber, setHelpPageNumber] = useState<number>(1);

  const {
    // @ts-ignore
    data: { discussPosts, length },
    mutate: discuss_posts_mutate,
  } = useSWR<MyInterface>(`post/all/discuss/${id}pagenumber=${pageNumber}`, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    suspense: true,
  });

  // console.log(discussPosts, length);

  const {
    // @ts-ignore
    data: { helpPosts, length: helpPostsLength },
    mutate: help_posts_mutate,
  } = useSWR<MyInterface>(`post/all/help/${id}pagenumber=${helpPageNumber}`, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    suspense: true,
  });

  // console.log(helpPosts, helpPostsLength);

  const [value, setValue] = useState(0);
  const [showPostingModal, setShowPostingModal] = useState<boolean>(false);

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setValue(newValue);
    await discuss_posts_mutate();
    await help_posts_mutate();
  };

  const mutate = async () => {
    await discuss_posts_mutate();
    await help_posts_mutate();
  };

  const handlePageChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageNumber(value);
    await discuss_posts_mutate();
    await help_posts_mutate();
  };

  const handleHelpPageChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setHelpPageNumber(value);
    await help_posts_mutate();
    await discuss_posts_mutate();
  };

  const { data: contests } = useSWR<Contest[]>(`contest/department/${id}`, {
    suspense: true,
  });

  const [selectedContestId, setSelectedContestId] = useState<number>();
  const [showCreateGroupModal, setShowCreateGroupModal] =
    useState<boolean>(false);

  // console.log(contests);

  return (
    <>
      {/* <div>RealDepartment</div> */}
      <PostingModal
        open={showPostingModal}
        handleClose={() => setShowPostingModal(!showPostingModal)}
        departmentName={department!.name}
        mutate={mutate}
      />
      <CreateGroupModal
        open={showCreateGroupModal}
        handleClose={() => setShowCreateGroupModal(!showCreateGroupModal)}
        id={selectedContestId}
      />
      <Paper
        sx={{
          padding: "2rem",
        }}
        elevation={12}
      >
        <Box
          sx={{
            //   height: "40vh",
            //   width: "70vw",
            //   overflow: "scroll",
            marginBottom: ".5rem",
          }}
        >
          {/* <PostEditor /> */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowPostingModal(!showPostingModal)}
          >
            发帖子
          </Button>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="讨论" {...a11yProps(0)} />
              <Tab label="求助" {...a11yProps(1)} />
              <Tab label="组队参赛" {...a11yProps(2)} />
              <Tab label="资源分享" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {/* Item One */}
            <Stack direction={"column"} spacing={2}>
              {discussPosts?.map((post: Post) => {
                return (
                  <SinglePost
                    key={post.id}
                    id={post.id}
                    post={post}
                    postMutate={discuss_posts_mutate}
                  />
                );
              })}
            </Stack>
            <Pagination
              sx={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center",
              }}
              count={Math.ceil(length / 5)}
              variant="outlined"
              color="secondary"
              page={pageNumber}
              onChange={handlePageChange}
            />
            {/* TODO:帖子发布,展示,分为求助贴和讨论贴 */}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {/* Item Two */}
            <Stack direction={"column"} spacing={2}>
              {helpPosts?.map((post: Post) => {
                return (
                  <SinglePost
                    key={post.id}
                    id={post.id}
                    post={post}
                    postMutate={help_posts_mutate}
                  />
                );
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
              page={helpPageNumber}
              onChange={handleHelpPageChange}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {/* TODO:组队参赛 */}
            <Stack direction={"column"} spacing={2}>
              <Button disabled>社团内所有比赛</Button>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell align="right">比赛标题</TableCell>
                      <TableCell align="right">比赛发布者</TableCell>
                      <TableCell align="right">结束时间</TableCell>
                      <TableCell align="right">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contests?.map((contest) => (
                      <TableRow
                        key={contest.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {contest.id}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: "30%",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            // whiteSpace: "nowrap",
                          }}
                        >
                          {contest.title}
                        </TableCell>
                        <TableCell align="right">
                          {contest.publisher?.username}
                        </TableCell>
                        <TableCell align="right">
                          {moment(contest.endDate).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell align="right">
                          {moment(contest.endDate).isBefore() ? (
                            <Button color="warning">已经结束</Button>
                          ) : (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  setSelectedContestId(contest.id);
                                  setShowCreateGroupModal(
                                    !showCreateGroupModal
                                  );
                                }}
                              >
                                创建队伍
                              </Button>

                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  setSelectedContestId(contest.id);
                                  // setShowEditContestModal(!showEditContestModal);
                                }}
                              >
                                查询队伍
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Box>
              <Button
                variant="outlined"
                sx={{ color: "skyblue", marginBottom: 1 }}
              >
                资源上传
              </Button>
              <FileUpload department_id={Number(id)} />
            </Box>
            <Divider sx={{ marginY: 3 }} />
            <Box display={"flex"} justifyContent={"center"}>
              {/* TODO: */}
              <Link href={`/stu/department/resources/${id}`}>
                查看本社团所有资源
              </Link>
            </Box>
          </CustomTabPanel>
        </Box>
      </Paper>
    </>
  );
};

export default RealDepartment;
