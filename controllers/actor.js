require('dotenv').config();
const actorRouter = require("express").Router();
const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.TMDB_KEY);

actorRouter.get('/', async(req, res, next) => {
})

actorRouter.get("/:id", async (req, res, next) => {
    try {

        const id = String(req.params.id).split('-').pop();
        const actorInfo = await moviedb.personInfo({id: id});
        const actorCredits = await moviedb.personTvCredits({id: id})

        
        actorInfo.profile_path = `http://image.tmdb.org/t/p/h632${actorInfo.profile_path}`;
        for (let i = 0; i < actorCredits.cast.length; i++) {
            // actorCredits.cast[i].credit_info = await moviedb.creditInfo(actorCredits.cast[i].credit_id)
            if (actorCredits.cast[i].poster_path) {
                actorCredits.cast[i].poster_path = `http://image.tmdb.org/t/p/w200${actorCredits.cast[i].poster_path}`;
            } else {
                actorCredits.cast[i].poster_path = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"
            }
        }
        
        // Filter out duplicate credits
        // console.log(actorCredits.cast);
        actorCredits.cast = actorCredits.cast.filter((credit, index, self) => self.findIndex(c => c.id === credit.id) === index);

        res.json({actorInfo, actorCredits})
    } catch (e) {
        console.error(e);
    }
})

module.exports = actorRouter;