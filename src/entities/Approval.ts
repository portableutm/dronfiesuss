import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, CreateDateColumn, OneToMany } from "typeorm";
import { Operation } from "./Operation";
import { User } from "./User";

@Entity()
export class Approval {
    @PrimaryGeneratedColumn("uuid")
    id?: string;


    @Column({nullable:true})
    comment?: string;

    @OneToOne("Operation", {eager:true })
    @JoinColumn()
    operation : Operation

    @ManyToOne("User",)
    @JoinColumn()
    user : User

    // @Column({type: "timestamp without time zone"})
    @CreateDateColumn({ type: "timestamp without time zone" })
    'time'? : string

    @Column()
    approved: boolean;
    
    

}