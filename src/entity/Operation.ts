import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Operation {

    @PrimaryGeneratedColumn()
    id: number;


}
