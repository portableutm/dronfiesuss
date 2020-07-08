import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, CreateDateColumn, OneToMany } from "typeorm";
import { Operation } from "./Operation";
import { User } from "./User";

@Entity()
export class QuickFly {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({nullable:true})
    name?: string;

    @Column("geometry", {nullable: true})
    cornerNW: GeoJSON.Point;

    @Column("geometry", {nullable: true})
    cornerSE: GeoJSON.Point;

    @ManyToOne(type => User, user => user.quickFlys )
    @JoinColumn()
    user:  Promise<User>



}