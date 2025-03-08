import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("split")
export class SplitModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false })
  splitUserId: string;

  @Column({ nullable: false })
  splitWeight: number;
}

export type SplitEntity = {
  id?: number;
  userId: string;
  weight: number;
};

export const splitMapper = (s: SplitModel) =>
  ({
    id: s.id,
    userId: s.splitUserId,
    weight: s.splitWeight,
  } as SplitEntity);
