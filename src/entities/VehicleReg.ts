import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn   } from "typeorm";

@Entity()
export class VehicleReg {
    @PrimaryGeneratedColumn("uuid")
    'uvin' : string;
    // @Column()
    // 'date' : string;
    @Column({nullable:true})
    'registeredBy' : string;
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