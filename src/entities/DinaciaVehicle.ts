
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique, PrimaryColumn, OneToOne, JoinColumn, OneToMany, JoinTable
} from "typeorm";


@Entity()
export class DinaciaVehicle {
    @PrimaryGeneratedColumn("uuid")
    'id'?: string;


    // fabricante
    // modelo
    // tipo_dispositivo: "ala_fija" | "rotatorio"

    @Column({ default: false })
    authorized: boolean;


    @Column({ nullable: true })
    caa_registration?: string;
    
    @Column({ nullable: true })
    serial_number_file_path?: string;


    @Column({ nullable: true })
    usage?: string;
    @Column({ nullable: true })
    construction_material?: string;
    @Column({ default: new Date().getFullYear(), nullable: true  })
    year?: string;
    @Column({ nullable: true })
    serial_number?: string;
    @Column({ nullable: true })
    empty_weight?: number;
    @Column({ nullable: true })
    max_weight?: number;
    @Column({ nullable: true })
    takeoff_method?: string;
    @Column({ nullable: true })
    sensor_type_and_mark?: string;
    @Column({ nullable: true })
    packing?: string;
    @Column({ nullable: true })
    longitude?: number;
    @Column({ nullable: true })
    height?: number;
    @Column({ nullable: true })
    color?: string;
    @Column({ nullable: true })
    max_speed?: number;
    @Column({ nullable: true })
    cruise_speed?: number;
    @Column({ nullable: true })
    landing_speed?: number;
    @Column({ nullable: true })
    time_autonomy?: string;
    @Column({ nullable: true })
    radio_accion?: string;
    @Column({ nullable: true })
    ceiling?: string;
    @Column({ nullable: true })
    communication_control_system_command_navigation_vigilance?: string;
    @Column({ nullable: true })
    maintenance_inspections?: string;
    @Column({ nullable: true })
    remarks?: string;

    @Column({ nullable: true })
    engine_manufacturer?: string;
    @Column({ nullable: true })
    engine_type?: string;
    @Column({ nullable: true })
    engine_model?: string;
    @Column({ nullable: true })
    engine_power?: string;
    @Column({ nullable: true })
    engine_fuel?: string;
    @Column({ nullable: true })
    engine_quantity_batteries?: string;
    @Column({ nullable: true })
    propeller_type?: string;
    @Column({ nullable: true })
    propeller_model?: string;
    @Column({ nullable: true })
    propeller_material?: string;


    @Column({ nullable: true })
    remote_sensor_file_path?: string;

    @Column({ nullable: true })
    remote_sensor_id?: string;

    

    // @Column()
    // uso: string;
    // @Column()
    // material_construccion: string;
    // @Column()
    // ano: string;
    // @Column()
    // numero_serie: string;
    // @Column()
    // peso_vacio: string;
    // @Column()
    // peso_maximo: string;
    // @Column()
    // metodo_despegue: string;
    // @Column()
    // tipo_sensor_y_marca: string;
    // @Column()
    // envargadura: string;

    // @Column()
    // largo: string;
    // @Column()
    // altura: string;
    // @Column()
    // color: string;
    // @Column()
    // velocidad_maxima: string;
    // @Column()
    // velocidad_crucero: string;
    // @Column()
    // velocidad_atarreizaje: string;
    // @Column()
    // tiempo_autonomia: string;
    // @Column()
    // radio_accion: string;
    // @Column()
    // techo: string;
    // @Column()
    // sistema_de_control_comunicacion_comando_navegacion_vigilancia: string;
    // @Column()
    // mantenimiento_inspecciones: string;
    // @Column()
    // observaciones: string;

    // @Column()
    // motor_fabricante: string;
    // @Column()
    // motor_tipo: string;
    // @Column()
    // motor_modelo: string;
    // @Column()
    // motor_potencia: string;
    // @Column()
    // motor_combustible: string;
    // @Column()
    // motor_cantidad_baterias: string;
    // @Column()
    // helice_tipo: string;
    // @Column()
    // helice_modelo: string;
    // @Column()
    // helice_material: string;





}