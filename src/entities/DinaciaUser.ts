
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique, PrimaryColumn, OneToOne, JoinColumn, OneToMany, JoinTable
} from "typeorm";
import { DinaciaBusiness } from "./DinaciaBusiness";


@Entity({})
export class DinaciaUser
{

    @PrimaryGeneratedColumn("uuid")
    'id'?: string;

    // Nombre:
    @Column()
    domicilio : string;
    @Column()
    tipo_documento : string;
    @Column()
    numero_documento : string;
    @Column()
    telefono : string;
    @Column()
    celular : string;
    @Column()
    nacionalidad : string;


    @OneToOne("DinaciaBusiness", {
        eager:true, cascade : true
    })
    @JoinColumn()
    dinacia_business?: DinaciaBusiness;
    
    
}