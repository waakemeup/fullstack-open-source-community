import axios from "../api";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const downloadFile = async (
  fileId: number,
  fileName: string,
  totalSize: bigint
) => {
  try {
    NProgress.start();

    NProgress.setColor = (color) => {
      const style = document.createElement("style");
      style.textContent = `
      #nprogress .bar {
        background: ${color} !important;
        z-index:2000 !important;
      }
      `;
      document.body.appendChild(style);
    };

    NProgress.setColor("#ff0000");
    const response = await axios.get(`file/${fileId}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / Number(totalSize)) * 100
        );
        console.log(`Download progress: ${progress}%`);
        NProgress.set(progress / 100);
      },
    });
    NProgress.done();
    console.log(response);

    // const fileName = response.headers["content-disposition"]
    //   .split(";")[1]
    //   .split("=")[1]
    //   .trim();
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log(error);
  }
};

export default downloadFile;
