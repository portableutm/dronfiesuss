import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class TestEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "date", transformer: {
        from(value) {
          console.log('from', value, typeof(value));
          return value;
        },
  
        to(value) {
          console.log('to', value, typeof(value));
          return value;
        }
      }})
    tDate: string;

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
    tTimestamp: string;

    // @Column({type: "timestamp", transformer: {
    //     from(value) {
    //       console.log('from', value, typeof(value));
    //       return value;
    //     },
  
    //     to(value) {
    //       console.log('to', value, typeof(value));
    //       return value;
    //     }
    //   }})
    // tTimestampDate: Date;


}
