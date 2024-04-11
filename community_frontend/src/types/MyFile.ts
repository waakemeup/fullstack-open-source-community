import Department from "./Department";
import FileStatusEnum from "./enums/FileStatusEnum";
import { User } from "./User";

export default interface MyFile {
  data: string;
  id: number;
  createdAt: string;
  updatedAt: "2024-04-11T08:29:23.732Z";
  originalName: "8dfe88291e145352cd45c8c4be954347.jpeg";
  mimeType: "image/jpeg";
  size: bigint;
  encoding: string;
  status: FileStatusEnum;
  user: User;
  department: Department;
}
