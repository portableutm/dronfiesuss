import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { type } from "os";

export enum vehicleType {
    MULTIROTOR = "MULTIROTOR",
    FIXEDWING = "FIXEDWING",
    VTOL = "VTOL",
    OTRO = "OTRO"
}

@Entity()
export class VehicleReg {
    @PrimaryGeneratedColumn("uuid")
    uvin?: string;

    //fecha de registro, poner automaticamente, ignorar en json
    @CreateDateColumn({ type: "timestamp" })
    'date'?: string;


    @ManyToOne(type => User, {
        eager: true
    })
    registeredBy?: User;

    @ManyToOne(type => User, {
        eager: true
    })
    owner?: User;

    @Column({ nullable: true })
    'nNumber': string;

    @Column({ nullable: true })
    'faaNumber'?: string;

    //obligatiorio string de 1 a 255 caracteres, con trim 
    @Column()
    'vehicleName': string;

    @Column({ nullable: true })
    'manufacturer'?: string;

    @Column({ nullable: true })
    'model'?: string;

    // example: "Multi-Rotor", definir enum: multirotor, fixedWing, vtol y otro
    @Column()
    'class': vehicleType;

    //public private
    @Column({ nullable: true })
    'accessType'?: string;

    @Column({ nullable: true })
    'vehicleTypeId': string;

    @Column({ nullable: true })
    'org-uuid': string;
}