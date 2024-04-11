import axios from "../api";

const downloadFile = async (fileId: number, fileName: string) => {
  try {
    const response = await axios.get(`file/${fileId}`, {
      responseType: "blob",
    });
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
