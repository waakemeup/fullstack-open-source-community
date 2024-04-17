import Contest from "./Contest";
import { User } from "./User";

export default interface Group {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  contest: Contest;
  creator: User;
  users: User[];
  applyUsers: User[];
}
