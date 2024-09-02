import {
  Table,
  Column,
  Model,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'users', omitNull: true })
export class User extends Model {
  @Column
  name: string;

  @Column
  email: string;

  @Column
  password: string;

  @AllowNull
  @Column
  phone: string;

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;
}
