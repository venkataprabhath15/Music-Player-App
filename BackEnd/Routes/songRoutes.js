import express from 'express';
import {protect} from '../Middleware/authmiddleware.js';
import { getPlaylistbytag , getSongs , toggleFavourite } from '../controllers/songController.js';

const songRouter = express.Router();

songRouter.get('/', getSongs);
songRouter.get('/playlistBytag/:tag', getPlaylistbytag);
songRouter.post('/favourite', protect, toggleFavourite);
songRouter.get("/favourites", protect, async (req, res) => {
    res.json(req.user.favourites)
});

export default songRouter;