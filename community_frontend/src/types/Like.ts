import LikeValueEnum from "./enums/LikeValueEnum";

export default interface Like {
  id: number;
  createdAt: string;
  updatedAt: string;
  value: LikeValueEnum | number; //[0,1]
  likeUserId: number;
}
