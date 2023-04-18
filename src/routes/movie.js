import express from 'express';
import auth from '../../middleware/auth.js';
import movieModel from '../../models/MovieModel.js';

const router = express.Router();

//create
router.post('/',auth, async (req, res) => {
   
        const newMovie = new movieModel(req.body)
        try {
            const savedMovie = await newMovie.save()
            res.status(201).json(savedMovie)
        } catch (error) {
          console.log(error)
            res.status(500).json(error)
        }
   
})



//update
router.put('/:id',auth, async (req, res) => {
    //if (req.user.isAdmin) {
        try {
          const updatedMovie = await movieModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
          console.log(req.params.id)
            res.status(201).json(updatedMovie)
        } catch (error) {
            res.status(404).json(error)
        }
   // } else {
    //   res.status(403).json('you are not allowed')
    //}
})

//delete
router.delete('/:id',auth, async (req, res) => {
    if (req.user.isAdmin) {
        try {
         await movieModel.findByIdAndDelete(req.params.id)
            res.status(201).json('deleted successfully')
        } catch (error) {
            res.status(404).json(error)
        }
    } else {
        res.status(403).json('you are not allowed')
    }
})


//getOne
router.get('/find/:id', async (req, res) => {
    
        try {
        const theMovie = await movieModel.findById(req.params.id)
            res.status(200).json(theMovie)
        } catch (error) {
            res.status(404).json(error)
        }
    
})


//getAll
router.get('/',auth, async (req, res) => {
    if (req.user.isAdmin) {
        try {
          const movies = await movieModel.find();
          res.status(200).json(movies.reverse());
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(403).json("You are not allowed!");
      }
    
})


//GET RANDOM

router.get("/random", auth, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
      if (type === "series") {
        movie = await movieModel.aggregate([
          { $match: { isSeries: true } },
          { $sample: { size: 1 } },
        ]);
      } else {
        movie = await movieModel.aggregate([
          { $match: { isSeries: false } },
          { $sample: { size: 1 } },
        ]);
      }
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
  });









export {router as movieRouter}