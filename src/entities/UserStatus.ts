import {Entity, PrimaryGeneratedColumn, Column, Unique, PrimaryColumn} from "typeorm";

// export type Role = "admin" | "pilot"

export enum Status {
    UNCONFIRMED = "unconfirmed"
    ,CONFIRMED = "confirmed"
}

@Entity()
export class UserStatus {

    @PrimaryGeneratedColumn()
    id?: String;

    @Column({default: ""})
    token: String;

    @Column({default: Status.UNCONFIRMED})
    status: Status;

}
