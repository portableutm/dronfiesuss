import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne, CreateDateColumn, JoinColumn, OneToOne, JoinTable, ManyToMany } from "typeorm";
import { User } from "./User";
import { type } from "os";
import { DinaciaVehicle } from "./DinaciaVehicle";

export enum vehicleType {
    MULTIROTOR = "MULTIROTOR",
    FIXEDWING = "FIXEDWING",
    VTOL = "VTOL",
    OTRO = "OTRO"
}

export enum VehicleAuthorizeStatus {
    PENDING = "PENDING",
    AUTHORIZED = "AUTHORIZED",
    NOT_AUTHORIZED = "NOT_AUTHORIZED",
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

    @ManyToMany(() => User, { eager:true, nullable: true })
    @JoinTable()
    operators?: User[];

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

    @Column({ unique: true, nullable: true })
    'trackerId'?: string


    @Column({default:VehicleAuthorizeStatus.PENDING})
    authorized?: VehicleAuthorizeStatus;

    @OneToOne("DinaciaVehicle", { eager: true, cascade: true, nullable: true })
    @JoinColumn()
    dinacia_vehicle?: DinaciaVehicle;
}