
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique, PrimaryColumn, OneToOne, JoinColumn, OneToMany, JoinTable
} from "typeorm";


@Entity()
export class DinaciaCompany {

    @PrimaryGeneratedColumn("uuid")
    'id'?: string;


    @Column({ nullable: true })
    razon_social?: string;

    @Column({ nullable: true })
    nombre_comercial?: string;

    @Column({ nullable: true })
    domicilio?: string;

    @Column({ nullable: true })
    telefono?: string;

    @Column({ nullable: true })
    RUT?: string;

    // @Column()
    // representante : string;




}