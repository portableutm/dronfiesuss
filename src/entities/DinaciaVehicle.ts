
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique, PrimaryColumn, OneToOne, JoinColumn, OneToMany, JoinTable
} from "typeorm";


@Entity({})
export class DinaciaVehicle
{    
    @PrimaryGeneratedColumn("uuid")
    'id'?: string;


    // fabricante
    // modelo
    // tipo_dispositivo: "ala_fija" | "rotatorio"

    @Column()
    uso: string;
    @Column()
    material_construccion: string;
    @Column()
    ano: string;
    @Column()
    numero_serie: string;
    @Column()
    peso_vacio: string;
    @Column()
    peso_maximo: string;
    @Column()
    metodo_despegue: string;
    @Column()
    tipo_sensor_y_marca: string;
    @Column()
    envargadura: string;
    @Column()
    largo: string;
    @Column()
    altura: string;
    @Column()
    color: string;
    @Column()
    velocidad_maxima: string;
    @Column()
    velocidad_crucero: string;
    @Column()
    velocidad_atarreizaje: string;
    @Column()
    tiempo_autonomia: string;
    @Column()
    radio_accion: string;
    @Column()
    techo: string;
    @Column()
    sistema_de_control_comunicacion_comando_navegacion_vigilancia: string;
    @Column()
    mantenimiento_inspecciones: string;
    @Column()
    observaciones: string;
    @Column()
    motor_fabricante: string;
    @Column()
    motor_tipo: string;
    @Column()
    motor_modelo: string;
    @Column()
    motor_potencia: string;
    @Column()
    motor_combustible: string;
    @Column()
    motor_cantidad_baterias: string;
    @Column()
    helice_tipo: string;
    @Column()
    helice_modelo: string;
    @Column()
    helice_material: string;
    


  
    
}