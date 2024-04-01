import { Box } from "@mui/material";
import { Suspense } from "react";
import View from "./components/View";
import { MessageBox } from "mui-message";

function App() {
  return (
    <>
      <MessageBox />
      <Suspense
        fallback={
          <>
            <Box display={"flex"} alignItems={"center"}>
              Page is Loading...
            </Box>
          </>
        }
      >
        <View />
      </Suspense>
    </>
  );
}

export default App;
