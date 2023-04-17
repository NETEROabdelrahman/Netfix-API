import express from 'express';
import bcrypt from "bcrypt";
import auth from '../../middleware/auth.js';
import userModel from '../../models/UserModel.js';

const router = express.Router();



//update
router.put('/:id',auth, async (req, res) => {
    
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10)
            console.log(req.body.password)
            try {
                const updatedUser = await userModel.findByIdAndUpdate(
                  req.params.id,
                  {
                    $set: req.body,
                  },
                  { new: true }
                );
                console.log(updatedUser)
                res.status(200).json(updatedUser);
            } catch (err) {
                console.log(err)
                res.status(500).json(err);
              }
        } else {
          res.status(403).json("You can update only your account!");
          }
    }else {
        res.status(403).json("You can update only your account!");
      }
})


//delete
router.delete('/:id',auth, async (req, res) => {
    
    if (req.user.id === req.params.id || req.user.isAdmin) {
            try {
                const updatedUser = await userModel.findByIdAndDelete( req.params.id);
                console.log(updatedUser)
                res.status(200).json("user has been deleted");
            } catch (err) {
                console.log(err)
                res.status(500).json(err);
              }
          
    }else {
        res.status(403).json("You can delete only your account!");
      }
})

//getOne

router.get('/find/:id', async (req, res) => {
    
    
            try {
                const users = await userModel.find();
                console.log(users)
                res.status(200).json(users);
            } catch (err) {
                console.log(err)
                res.status(500).json(err);
              }
          
    
})


//getAll
router.get('/',auth, async (req, res) => {
    
    const query = req.query.new
            
                if (req.user.isAdmin) {
                    try {
                      const users = query
                        ? await userModel.find().sort({ _id: -1 }).limit(5)
                        : await userModel.find();
                      res.status(200).json(users);
                    } catch (err) {
                      res.status(500).json(err);
                    }
                  } else {
                    res.status(403).json("You are not allowed to see all users!");
                  }
            
          
    
})


//GET USER STATS
router.get("/stats", async (req, res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() - 1);
  
    try {
      const data = await userModel.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });


export  {router as userRouter}