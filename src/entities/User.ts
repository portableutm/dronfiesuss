import {Entity, PrimaryGeneratedColumn, Column, Unique, PrimaryColumn, OneToOne, JoinColumn} from "typeorm";
import { UserStatus } from "./UserStatus";
import { Polygon } from "geojson";

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

    @Column({default:Role.PILOT})
    role: Role;

    @OneToOne("UserStatus", {lazy:true, cascade : ["insert"]   })
    @JoinColumn()
    status? : UserStatus

    @Column("geometry", {nullable: true})
    VolumesOfInterest?: Polygon;

}
