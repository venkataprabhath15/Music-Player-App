import axios from 'axios';

const getSongs = async (req, res) => {
    try {
        const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/?client_id=1e2f46e9&format=jsonpretty&limit=200`);
        const data = response.data
        res.status(200).json(data);

    }
    catch (error) {
        console.error("Error fetching songs:", error.message);
        res.status(500).json({ message: "Error fetching songs", error: error.message });
    }
}

const getPlaylistbytag = async (req, res) => {
    try {
    const tag  = (req.params.tag || req.query.tag || "").toString().trim();
    if(!tag){
        return res.status(400).json({ message: "Tag parameter is required" });
    }
    const limit = parseInt(req.query.limit ?? "10" , 10)||10;
    const clientId="1e2f46e9";
    const params ={
        client_id:clientId,
        format:"jsonpretty",
        tags:tag,
        limit,
    };
    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', { params });
    const data = response.data;
    res.status(200).json(data);
    }
    catch (error) {
        console.error("Error fetching playlist by tag:", error?.response?.data || error.message);        
        res.status(500).json({ message: "Failed to fetch playlist by tag" });
    }
};

const toggleFavourite = async (req, res) => {
    try {
        const user = req.user;
        const { song } = req.body;
        const exists = user.favourites.find(fav => fav.id === song.id);
        if (exists) {
            user.favourites = user.favourites.filter(fav => fav.id !== song.id);
        } else {
            user.favourites.push(song);
        }
        await user.save();
        res.status(200).json({ message: "Favourites updated successfully", favourites: user.favourites });
    } catch (error) {
        console.error("toggleFavourite error:", error.message);
        res.status(500).json({ message: "Failed to update favourites" });
    }
};

export { getSongs, getPlaylistbytag, toggleFavourite };