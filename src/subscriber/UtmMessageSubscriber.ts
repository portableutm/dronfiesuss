import {EventSubscriber, EntitySubscriberInterface, InsertEvent} from "typeorm";
import { UTMMessage } from "../entities/UTMMessage";
import { app } from "../index";



@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<UTMMessage> {


    /**
     * Indicates that this subscriber only listen to Post events.
     */
    listenTo() {
        return UTMMessage;
    }

    /**
     * Called before post insertion.
     */
    beforeInsert(event: InsertEvent<UTMMessage>) {
        // console.log(`BEFORE POST INSERTED: `, event.entity);
    }

    /**
     * Called before post insertion.
     */
    afterInsert(event: InsertEvent<UTMMessage>) {
        // console.log(`** AFTER POST INSERTED: `, event.entity);
        // app.io.sockets.emit()
        // app.io.sockets.emit('chat message', `Nuevo UtmMessage: ${JSON.stringify(event.entity    )}`)
    }

}