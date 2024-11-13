import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class WatchlistDto {

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    assetId: string
}