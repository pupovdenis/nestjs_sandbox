import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {Watchlist} from "../../watchlist/models/watchlist.model";

@Table
export class User extends Model {
    @Column
    firstname: string

    @Column
    lastname: string

    @Column
    login: string

    @Column
    password: string

    @Column
    email: string

    @HasMany(() => Watchlist, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    watchlist: Watchlist[]
}