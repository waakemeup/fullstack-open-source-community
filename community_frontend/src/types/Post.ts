import Department from "./Department";
import PostTypeEnum from "./enums/PostTypeEnum";
import { User } from "./User";

export default interface Post {
  id: number;
  createdAt: string;
  updatedAt: string;
  identifier: string;
  title: string;
  body: string;
  departmentName: string;
  type: PostTypeEnum;
  department: Department;
  user: User;
}
