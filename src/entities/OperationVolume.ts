import { Polygon } from "geojson";
import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne
} from "typeorm";
import { Operation } from "./Operation";


@Entity()
export class OperationVolume {
    @PrimaryGeneratedColumn()
    'id': number;

    //inicialmente sera 1, lo voy a hardocodear en 0
    @Column({default:0})
    'ordinal': number;

    //nulleable, que sea uno de los dos valores
    @Column({nullable:true})
    'volume_type'?: "TBOV" | "ABOV";

    // nulleable
    @Column({nullable:true})
    'near_structure'?: boolean;


    //solo crear operaciones al futuro (solo chequear finalizacion)
    //chequear que hora de empezar < hora de fin
    //duracion: 15 minutos y 5hs
    @Column({type: "timestamp without time zone"})
    'effective_time_begin': string;
    
    @Column({type: "timestamp without time zone"})
    'effective_time_end': string;
    
    //nulleable, se setea automaticamente cuando la operacion pasa a close
    @Column({type: "timestamp without time zone", nullable:true})
    'actual_time_end'?: string;
    
    //valor en metros, min -300 y 0  
    @Column({type: 'numeric'})
    'min_altitude': number;

    //valor en metros, max 0 y 120mts, 400
    @Column({type: 'numeric'})
    'max_altitude': number;

    //chequeo que este correctamente creado el poligono
    //chequear las coordenadas pasadas
    @Column("geometry", {nullable: true})
    'operation_geography': Polygon;


    @Column()
    'beyond_visual_line_of_sight': boolean;

    @ManyToOne(type => Operation, user => user.operation_volumes)
    operation: Operation
}

// export class Altitude {
//     'altitude_value': number;
//     'vertical_reference': "W84";
//     'units_of_measure': "FT";
//     'source'?: "ONBOARD_SENSOR" | "OTHER";
// }



// @Column({type: "timestamp"
// , transformer: {
//   from(value) {
//     console.log('from', value, typeof(value));
//     return value;
//   },

//   to(value) {
//     console.log('to', value, typeof(value));
//     return value;
//   }
// }
// })