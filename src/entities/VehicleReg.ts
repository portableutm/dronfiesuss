import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne   } from "typeorm";
import { User } from "./User";

@Entity()
export class VehicleReg {
    @PrimaryGeneratedColumn("uuid")
    uvin? : string;
    // @Column()
    // 'date' : string;
    @ManyToOne(type => User,{
        eager: true
    })
    registeredBy? : User;
    @Column({nullable:true})
    'nNumber' : string;
    @Column({nullable:true})
    'faaNumber' : string;
    @Column({nullable:true})
    'vehicleName' : string;
    @Column({nullable:true})
    'manufacturer' : string;
    @Column({nullable:true})
    'model' : string;
    @Column({nullable:true})
    'class' : string;
    @Column({nullable:true})
    'accessType' : string;
    @Column({nullable:true})
    'vehicleTypeId' : string;

    @Column({nullable:true})
    'org-uuid' : string;
}