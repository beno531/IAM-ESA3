/**
 * @author Jörn Kreutel
 *
 * Modifiziert im Pair Programming Verfahren durch: Benito Ernst, Arthur Muszynski
 * 
 * this skript defines the data types used by the application and the model operations for handling instances of the latter
 */


import {mwfUtils} from "../Main.js";
import {EntityManager} from "../Main.js";

/*************
 * example entity
 *************/

export class MyEntity extends EntityManager.Entity {

    // TODO-REPEATED: declare entity instance attributes

    constructor() {
        super();
    }

}

/* Klasse erstellt von Benito Ernst und Arthur Muszynski */
export class MediaItem extends EntityManager.Entity {
    constructor(title, src, description, contentType) {
        super();
        this.title = title;
        this.src = src;
        this.contentType = contentType;
        this.added = Date.now()
        this.description = description;
    }

    get addedDateString() {
        return (new Date(this.added)).toLocaleDateString();
    }

    get mediaType() {
        if (this.contentType) {
            var index = this.contentType.indexOf("/");
            if (index > -1) {
                return this.contentType.substring(0, index);
            } else {
                return "UNKNOWN";
            }
        } else {
            return "UNKNOWN";
        }
    }
}
