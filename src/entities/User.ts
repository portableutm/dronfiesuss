import {Entity, PrimaryGeneratedColumn, Column, Unique, PrimaryColumn} from "typeorm";

// export type Role = "admin" | "pilot"

export enum Role {
     ADMIN = "admin"
    ,PILOT = "pilot"
}

@Entity()
@Unique(["email"])
export class User {

    @PrimaryColumn()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: Role;



}
