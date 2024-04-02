import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./index.scss";
import { Button } from "@mui/material";
import axios from "../../api";
import Department from "../../types/Department";

interface Props {
  id: number;
  name: string;
}

const ImageUpload: React.FC<Props> = ({ id, name }) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    // 处理上传的文件
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop });

  const files = acceptedFiles.map((file: File) => (
    // @ts-ignore
    <li key={file.path}>
      {/* @ts-ignore */}
      {file.path} - {file.size} bytes
    </li>
  ));

  const lastFileUI = files[files.length - 1];

  const uploadImage = async (event: any) => {
    const lastFile = acceptedFiles[acceptedFiles.length - 1];
    // console.log("file:" + lastFile.type);
    const formData = new FormData();
    formData.append("file", lastFile);
    formData.append("type", lastFile.type);

    try {
      const res = await axios.post<Department>(
        `/department/${name}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>松开以选择文件</p>
        ) : (
          <p>拖放文件到此处，或点击以选择文件</p>
        )}
      </div>
      <aside>
        <h4>upload file</h4>
        <ul>{lastFileUI}</ul>
      </aside>
      <Button onClick={uploadImage} variant="contained">
        上传社团logo
      </Button>
    </>
  );
};

export default ImageUpload;
