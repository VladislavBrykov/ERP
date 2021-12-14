import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from './Role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  isAdmin!: boolean;

  @Column()
  phone!: string;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn()
  role!: number;

  @Column()
  passportSeries?: string;

  @Column()
  inn?: string;

  @Column()
  dateOfBirthday?: string;
}
