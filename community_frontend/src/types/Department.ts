import LevelEnum from "./enums/LevelEnum";
import RoleEnum from "./enums/RoleEnum";
import { User } from "./User";

export default interface Department {
  id: number;
  createdAt: string;
  description: string;
  img?: string | null;
  name: string;
  owner: {
    id: number;
    createdAt: string;
    updatedAt: string;
    email: string;
    username: string;
    level: LevelEnum;
    name: string;
    role: RoleEnum;
  };
  title: string;
  updatedAt: string;
  userId: number;
  imgUrl: string;
  applyUsers: User[];
  users: User[];
}
