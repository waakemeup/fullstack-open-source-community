import LevelEnum from "./enums/LevelEnum";
import RoleEnum from "./enums/RoleEnum";

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
}
