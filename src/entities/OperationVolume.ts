import { Polygon } from "geojson";
import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne
} from "typeorm";
import { Operation } from "./Operation";


@Entity()
export class OperationVolume {
    @PrimaryGeneratedColumn()
    'id': number;
    // @Column()
    'ordinal': number;
    'volume_type': "TBOV" | "ABOV";
    // 'near_structure'?: boolean;
    @Column({type: "timestamp without time zone"})
    'effective_time_begin': string;
    
    @Column({type: "timestamp without time zone"})
    'effective_time_end': string;
    
    // 'actual_time_end'?: string;
    
    @Column({type: 'numeric'})
    'min_altitude': number;
    @Column({type: 'numeric'})
    'max_altitude': number;
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