import { Box } from "@mui/material";
import { Suspense, useEffect } from "react";
import View from "./components/View";
import { MessageBox } from "mui-message";
import { useAuthState } from "./context/auth";

function App() {
  const { user, loading, authenticated } = useAuthState();

  useEffect(() => {
    // console.log([user, loading, authenticated]);
  }, [user, authenticated]);

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
