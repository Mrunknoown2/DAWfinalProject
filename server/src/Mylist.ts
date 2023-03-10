import * as path from "path";
import Nedb from "nedb";
import {iItems} from "./Items";
const Datastore = require("nedb");

export interface myList extends iItems{
    quantidade: number
}
export class Mylist {
    private db: Nedb

    constructor() {
        this.db = new Datastore( {
            filename: path.join(__dirname, "myList.db"),
            autoload: true
        } )
    }

    /**
     * This function returns a promise of an array of type myList, it will make a query to find all elements with
     * a certain value in key, in this case it searches for everything because there isn't anything in parameter
     * query, and it will return the objects that it has found during the find query, and assign what was retrieved
     * to the promise, or it will do an error
     * */
    public listMylist(): Promise<myList[]> {
        return new Promise((inResolve, inReject) => {
            this.db.find({},
                (inError: Error | null, inItems: myList[]) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(inItems);
                    }
                }
            );
        });
    }

    /**
     * This function will make a promise to add an object of type iItems to the database and return the object, or it will return
     * an error, before adding it will make the object that was passed, which was of type iItems, make a new variable of type myList
     * adding the key quantidade to it with value 1 and the insert in the query
     * */
    public addItems (item: iItems): Promise<myList> {
        return new Promise((inResolve, inReject) => {
            const newItem: myList = {
                name: item.name,
                img: item.img,
                quantidade: 1,
            }
            this.db.insert(newItem, (inError: Error | null, inItem: myList) => {
                if (inError) {
                    inReject(inError)
                }
                else {
                    inResolve(inItem)
                }
            })
        })
    }

    /**
     * This function will remove from the database an item that has the id that is passed as argument, after creating
     * a promise, and it will finish the function or make an error
     * */
    public deleteItemList (inID: string): Promise<void> {
        return new Promise((inResolve, inReject) => {
            this.db.remove({_id: inID}, {},
                (inError: Error | null) => {
                        if (inError) {
                            inReject(inError)
                        }
                        else {
                            inResolve()
                        }
                }
                )
        })
    }

    /**
     * This function will create a Promise that if the item passed isn't undefined it will update the object of the
     * that base that has the same name, after doing the query, and will change the name to the same name of the object
     * that is being passed, the same to the image, and the variable quantidade will increment 1 to the object that
     * was passed
     * */
    public incrementItem (item: myList): Promise<void> {
        return new Promise((inResolve, inReject) => {
            if (item !== undefined) {
                this.db.update({name: item.name}, {name: item.name, img: item.img, quantidade: item.quantidade+1}, {},
                    (inError: Error | null) => {
                        if (inError) {
                            inReject(inError)
                        }
                        else {
                            inResolve()
                        }
                    }
                )
            }
        })
    }

    /**
     * This function will create a Promise that if the item passed isn't undefined it will update the object of the
     * that base that has the same name, after doing the query, and will change the name to the same name of the object
     * that is being passed, the same to the image, and the variable quantidade will decrement 1 to the object that
     * was passed
     * */
    public decrementItem (item: myList): Promise<void> {
        return new Promise((inResolve, inReject) => {
            if (item !== undefined) {
                this.db.update({name: item.name}, {name: item.name, img: item.img, quantidade: item.quantidade-1}, {},
                    (inError: Error | null) => {
                        if (inError) {
                            inReject(inError)
                        }
                        else {
                            inResolve()
                        }
                    }
                )
            }
        })
    }

    /**
     * This function will make a promise that will delete everything according to the query that is presented, in
     * this case there isn't a query so it removes everything, because the multi is set to true
     * */
    public deleteDB (): Promise<void> {
        return new Promise((inResolve, inReject) => {
            this.db.remove({ },{ multi: true }, (inError: Error | null) => {
                if (inError) {
                    inReject(inError)
                }
                else {
                    inResolve()
                }
            })
        })
    }
}