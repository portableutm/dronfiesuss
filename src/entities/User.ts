import {Entity, PrimaryGeneratedColumn, Column, Unique, PrimaryColumn, OneToOne, JoinColumn, OneToMany, JoinTable} from "typeorm";
import { UserStatus } from "./UserStatus";
import { Polygon } from "geojson";
import { QuickFly } from "./QuickFly";
import { VehicleReg } from "./VehicleReg";


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

    @Column({select: false})
    password: string;

    @Column({default:Role.PILOT})
    role: Role;

    @OneToOne("UserStatus", {lazy:true, cascade : true   })
    @JoinColumn()
    status? : UserStatus

    @Column("geometry", {nullable: true})
    VolumesOfInterest?: Polygon;

    
    @Column(type => Settings)
    settings? : Settings;

    @OneToMany(type => QuickFly, quickFly => quickFly.user)
    quickFlys?:  Promise<QuickFly[]>;
    // quickFlys? : QuickFly;

    // @ManyToMany(type => VehicleReg, {
    //     eager: true
    // })
    // vehicles?: VehicleReg[];

}




class Settings {
    @Column( {default: Language.EN})
    langauge?: Language.ES
}
