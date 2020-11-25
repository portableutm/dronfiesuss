
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
    @Column({nullable:true})
    address?: string;
    @Column({nullable:true})
    document_type?: string;
    @Column({nullable:true})
    document_number?: string;
    @Column({nullable:true})
    phone?: string;
    @Column({nullable:true})
    cellphone?: string;
    @Column({nullable:true})
    nationality?: string;


    @OneToOne("DinaciaCompany", {
        eager: true, cascade: true, nullable:true
    })    
    @JoinColumn()
    dinacia_company?: DinaciaCompany;

    @Column({nullable:true})
    document_file_path?: string
    @Column({nullable:true})
    permit_front_file_path?: string
    @Column({nullable:true})
    permit_back_file_path?: string


}