import {
    Column, Entity, PrimaryGeneratedColumn, ManyToOne, BeforeInsert, AfterInsert
  } from "typeorm";
import { Operation } from "./Operation";

@Entity()
export class NegotiationAgreement {
    
    @PrimaryGeneratedColumn("uuid")
    'message_id' ? : string;
    @Column({nullable:true})
    'negotiation_id' ? : string;
    @Column()
    'uss_name' ? : string;
    @Column()
    'uss_name_of_originator' ? : string;
    @Column()
    'uss_name_of_receiver' ? : string;

    // @Column()
    @ManyToOne(type => Operation, {nullable:true})
    'gufi_originator' ? : Operation; //'gufi_originator' ? : string;

    // @Column()
    @ManyToOne(type => Operation, {nullable:true})
    'gufi_receiver' ? : Operation; //'gufi_receiver' ? : string;
    
    @Column()
    'free_text' ? : string;
    @Column()
    'discovery_reference' ? : string;
    @Column()
    'type' ? : "INTERSECTION" | "REPLAN";

    @BeforeInsert()
    updateNegotiationId() {
        if(this.negotiation_id === undefined){
            this.negotiation_id = "toUpdate"
        }
    }
    @AfterInsert()
    updateNegotationIdAfterInsert(){
        if(this.negotiation_id === undefined){
            this.negotiation_id = this.message_id
        }
    }


}