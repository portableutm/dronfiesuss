
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique, PrimaryColumn, OneToOne, JoinColumn, OneToMany, JoinTable
} from "typeorm";
import { DinaciaCompany } from "./DinaciaCompany";


@Entity({})
export class DinaciaUser {

    @PrimaryGeneratedColumn("uuid")
    'id'?: string;

    // Nombre:
    @Column()
    address?: string;
    @Column()
    document_type?: string;
    @Column()
    document_number?: string;
    @Column()
    phone?: string;
    @Column()
    cellphone?: string;
    @Column()
    nationality?: string;


    @OneToOne("DinaciaCompany", {
        eager: true, cascade: true, nullable:true
    })
    @JoinColumn()
    dinacia_company?: DinaciaCompany;

    @Column()
    document_file_path?: string
    @Column()
    permit_front_file_path?: string
    @Column()
    permit_back_file_path?: string


}