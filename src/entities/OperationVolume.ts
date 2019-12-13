import { Polygon } from "geojson";
import {
  Column
} from "typeorm";

export class OperationVolume {
    // 'ordinal': number;
    // 'volume_type': "TBOV" | "ABOV";
    // 'near_structure'?: boolean;
    @Column({type: "timestamp", transformer: {
      from(value) {
        console.log('from', value, typeof(value));
        return value;
      },

      to(value) {
        console.log('to', value, typeof(value));
        return value;
      }
    }})
    'effective_time_begin': string;
    
    @Column({type: "timestamp", transformer: {
      from(value) {
        console.log('from', value, typeof(value));
        return value;
      },

      to(value) {
        console.log('to', value, typeof(value));
        return value;
      }
    }})
    'effective_time_end': string;

    

    // 'actual_time_end'?: string;
    // 'min_altitude': Altitude;
    // 'max_altitude': Altitude;
    
    @Column()
    'min_altitude': number;
    @Column()
    'max_altitude': number;
    // @Column()
    @Column("geometry", {
        nullable: true
      })
    'operation_geography': Polygon;
    @Column()
    'beyond_visual_line_of_sight': boolean;
}

// export class Altitude {
//     'altitude_value': number;
//     'vertical_reference': "W84";
//     'units_of_measure': "FT";
//     'source'?: "ONBOARD_SENSOR" | "OTHER";
// }



