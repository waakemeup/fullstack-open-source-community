import Department from "./Department";
import LevelEnum from "./enums/LevelEnum";
import RoleEnum from "./enums/RoleEnum";
import Group from "./Group";

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  username: string;
  name: string;
  role: RoleEnum;
  level: LevelEnum;
  ownDepartment: Department | null;
  applyGroups: Group[];
  ownGroups: Group[];
  joinGroups: Group[];
}
