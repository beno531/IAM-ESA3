/**
 * @author Jörn Kreutel
 * 
 * Modifiziert im Pair Programming Verfahren durch: Benito Ernst, Arthur Muszynski
 */
import { MyApplication as application, mwf } from "../Main.js";
import { entities } from "../Main.js";
//import {GenericCRUDImplLocal} from "../Main.js";

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller
    items;
    addNewMediaItemElement;

    constructor() {
        super();
        console.log("ListviewViewController()");

        //this.crudops = GenericCRUDImplLocal.newInstance("MediaItem");
    }




    /*createNewItem() {
        let newItem = new entities.MediaItem("", "https://placekitten.com/100/100");
        this.showDialog("mediaItemDialog", {
            item: newItem,
            actionBindings: {
                submitForm: (event => {
                    event.original.preventDefault();
                    newItem.create().then(() => {
                        this.addToListview(newItem);
                    });
                    this.hideDialog();
                })
            }
        });
    }*/

    editItem(item) {
        /*this.crudops.update(item._id, item).then(() => {
            this.updateInListview(item._id, item);
        });*/
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: (event => {
                    event.original.preventDefault();
                    item.update().then(() => {
                        console.log(item);
                        this.updateInListview(item._id, item);
                    });
                    this.hideDialog();
                }),
                deleteItem: (event => {
                    event.original.preventDefault();
                    this.deleteItem(item);
                })
            }
        });
    }

    editItemFrm(item) {
        /*this.crudops.update(item._id, item).then(() => {
            this.updateInListview(item._id, item);
        });*/
        this.nextView("addMediaOverview", {item: item});
    }

    copyItem(item) {
        const newMediaItem = new entities.MediaItem(item.title, item.src, item.description);
        newMediaItem.create().then(() => {
            this.hideDialog();
        });
    }

    deleteItem(item) {
        /*this.crudops.delete(item._id).then(() => {
            this.removeFromListview(item._id);
        });*/
        this.showDialog("mediaItemConfirmDeletionDialog", {
            item: item,
            actionBindings: {
                submitForm: (event => {
                    event.original.preventDefault();
                    item.delete().then(() => {
                        this.notifyListeners(new mwf.Event("crud", "deleted", "MediaItem", item._id));
                    });
                    this.hideDialog();
                }),
                cancelAction: (() => {
                    this.hideDialog();
                })
            }
        })
    }

    // =============================================

    redrawView() {
        entities.MediaItem.readAll().then(items => {
            this.initialiseListview(items);
        });
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
        this.addNewMediaItemElement.onclick = () => {
            /*this.crudops.create(new entities.MediaItem("m", "https://placekitten.com/100/100")).then(created => {
                this.addToListview(created);
            });*/
            //this.createNewItem();
            this.nextView("addMediaOverview", {});

        };


        this.addListener(new mwf.EventMatcher("crud", "created", "MediaItem"),((event) => {
            this.addToListview(event.data);
        }));

        this.addListener(new mwf.EventMatcher("crud", "updated", "MediaItem"),((event) => {
            this.updateInListview(event.data._id, event.data);
        }));

        this.addListener(new mwf.EventMatcher("crud", "deleted", "MediaItem"),((event) => {
            this.removeFromListview(event.data);
        }));



this.redrawView();

this.switchCRUDOperationsElement = this.root.querySelector("#switchCRUDOperations");
this.currentCRUDScopeElement = this.root.querySelector("#currentCRUDScope");
this.switchCRUDOperationsElement.onclick = () => {
    application.switchCRUD(application.currentCRUDScope == "local" ? "remote" : "local");
    this.redrawView();
    this.currentCRUDScopeElement.textContent = application.currentCRUDScope;
};


// call the superclass once creation is done
super.oncreate();
}

/*
 * for views with listviews: bind a list item to an item view
 * TODO: delete if no listview is used or if databinding uses ractive templates
 */
/*bindListItemView(listviewid, itemview, itemobj) {
    // TODO: implement how attributes of itemobj shall be displayed in itemview
    itemview.root.querySelector("img").src = itemobj.src;
    itemview.root.querySelector("h2").textContent = itemobj.title + itemobj._id;
    itemview.root.querySelector("h3").textContent = itemobj.added;
}*/

/*
 * for views with listviews: react to the selection of a listitem
 * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
 */
/*onListItemSelected(itemobj, listviewid) {
    // TODO: implement how selection of itemobj shall be handled
    this.nextView("mediaReadview", {item: itemobj});
}*/

/*
 * for views with listviews: react to the selection of a listitem menu option
 * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
 */
onListItemMenuItemSelected(menuitemview, itemobj, listview) {
    // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    super.onListItemMenuItemSelected(menuitemview, itemobj, listview);
}

/*
 * for views with dialogs
 * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
 */
bindDialog(dialogid, dialogview, dialogdataobj) {
    // call the supertype function
    super.bindDialog(dialogid, dialogview, dialogdataobj);

    // TODO: implement action bindings for dialog, accessing dialog.root
}

    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
    // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    if (nextviewid == "mediaReadview" && (returnValue && returnValue.deletedItem)) {
        this.removeFromListview(returnValue.deletedItem._id);
    }
}

}

