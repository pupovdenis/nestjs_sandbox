import {Body, Controller, Delete, Post, Query, Req} from '@nestjs/common';
import {WatchlistService} from "./watchlist.service";
import {WatchlistDto} from "./dto";
import {CreateAssetResponse} from "./response";
import {ApiResponse, ApiTags} from "@nestjs/swagger";

@Controller('watchlist')
export class WatchlistController {

    constructor(private readonly watchlistService: WatchlistService) {
    }

    @ApiTags("API")
    @ApiResponse({status: 201, type: CreateAssetResponse})
    @Post()
    createAsset(@Body() assetDto: WatchlistDto, @Req() request): Promise<CreateAssetResponse> {
        const user = request.user;
        return this.watchlistService.createAsset(assetDto, user);
    }

    @ApiTags("API")
    @ApiResponse({status: 200})
    @Delete()
    deleteAsset(@Query("id") assetId: string, @Req() request): Promise<boolean> {
        const {id} = request.user;
        return this.watchlistService.deleteAsset(assetId, id);
    }
}
