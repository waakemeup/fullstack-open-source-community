import LevelEnum from "./enums/LevelEnum";
import RoleEnum from "./enums/RoleEnum";

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  username: string;
  name: string;
  role: RoleEnum;
  level: LevelEnum;
}
