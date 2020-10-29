
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

    @Column({default:false})
    authorized: boolean;


    @Column ()
    usage: string;
    @Column ()
    construction_material: string;
    @Column ()
    year: string;
    @Column ()
    serial_number: string;
    @Column ()
    empty_weight: number;
    @Column ()
    max_weight: number;
    @Column ()
    takeoff_method: string;
    @Column ()
    sensor_type_and_mark: string;
    @Column ()
    packing: string;
    @Column ()
    longitude: number;
    @Column ()
    height: number;
    @Column ()
    color: string;
    @Column ()
    max_speed: number;
    @Column ()
    cruise_speed: number;
    @Column ()
    landing_speed: number;
    @Column ()
    time_autonomy: string;
    @Column ()
    radio_accion: string;
    @Column ()
    ceiling: string;
    @Column ()
    communication_control_system_command_navigation_vigilance: string;
    @Column ()
    maintenance_inspections: string;
    @Column ()
    remarks: string;

    @Column ()
    engine_manufacturer: string;
    @Column ()
    engine_type: string;
    @Column ()
    engine_model: string;
    @Column ()
    engine_power: string;
    @Column ()
    engine_fuel: string;
    @Column ()
    engine_quantity_batteries: string;
    @Column ()
    propeller_type: string;
    @Column ()
    propeller_model: string;
    @Column ()
    propeller_material: string;

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