import Department from "./Department";
import { User } from "./User";

export default interface Notice {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  title: string;
  publisher: User;
  department: Department;
}
