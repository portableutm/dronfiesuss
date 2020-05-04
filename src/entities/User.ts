import {Entity, PrimaryGeneratedColumn, Column, Unique, PrimaryColumn, OneToOne, JoinColumn} from "typeorm";
import { UserStatus } from "./UserStatus";
import { Polygon } from "geojson";

// export type Role = "admin" | "pilot"

export enum Role {
     ADMIN = "admin"
    ,PILOT = "pilot"
}

export enum Language {
    ES = "ES",
    EN = "EN",
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

    // @OneToOne("UserSettings", {eager: true , cascade : true })
    // @JoinColumn()
    // settings? : UserSettings;

    
    @Column(type => Settings)
    settings? : Settings;

}




class Settings {
    @Column( {default: Language.EN})
    langauge?: Language.ES
}
