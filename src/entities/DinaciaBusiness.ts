
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique, PrimaryColumn, OneToOne, JoinColumn, OneToMany, JoinTable
} from "typeorm";


@Entity({})
export class DinaciaBusiness
{

    @PrimaryGeneratedColumn("uuid")
    'id'?: string;

  
    @Column()
    razon_social : string;

    @Column()
    nombre_comercial : string;
    
    @Column()
    domicilio : string;

    @Column()
    telefono : string;

    @Column()
    RUT : string;

    // @Column()
    // representante : string;


    

}