import express from 'express';
import auth from '../middleware/auth.js';
import listModel from '../models/ListModel.js';


const router = express.Router();


//create
router.post('/',auth, async (req, res) => {
    if (req.user.isAdmin) {
        const newList= new listModel(req.body)
        try {
            const savedList= await newList.save()
            res.status(201).json(savedList)
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json('you are not allowed')
    }
})


//delete
router.delete('/:id',auth, async (req, res) => {
    if (req.user.isAdmin) {
        
        try {
             await listModel.findByIdAndDelete(req.params.id)
            res.status(201).json('deleted list successfully')
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json('you are not allowed')
    }
})

//update
router.put('/:id',auth, async (req, res) => {
    if (req.user.isAdmin) {
        
        try {
            const updatedList = await listModel.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true})
            res.status(201).json(updatedList)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    } else {
        res.status(403).json('you are not allowed')
    }
})

//get
router.get('/', async (req, res) => {
    
        const typeQuery = req.query.type
        const genreQuery = req.query.genre
        let list = [];
        try {
            if (typeQuery) {

                if (genreQuery) {

                    list = await listModel.aggregate([
                        { $sample: { size: 15 } },
                        { $match: { type: typeQuery, genre: genreQuery } },
                    ]);
                } else {
                  
                    list = await listModel.aggregate([
                        { $sample: { size: 15 } },
                        { $match: { type: typeQuery } },
                    ]);
                }
            } else {
                
                list = await listModel.aggregate([{ $sample: { size: 15 } }]);
            }
            
            res.status(200).json(list);
        } catch (err) {
            res.status(500).json(err);
        }
    
});




export {router as listRouter}