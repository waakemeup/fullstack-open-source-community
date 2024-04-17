import Department from "./Department";
import { User } from "./User";

export default interface Contest {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  min: number;
  max: number;
  endDate: Date;
  department: Department;
  publisher: User;
}
