import express from 'express';
import { addComment,addReply,getComments,deleteComment,deleteReply } from '../controllers/comment.controllers.js';
import {setUser} from '../middlewares/setUser.js'

const router=express.Router()

router.post('/add-comment',setUser,addComment)
router.post('/add-reply/:commentId',setUser,addReply)
router.get('/get-comments/:postId',setUser,getComments)
router.delete('/delete-comment/:commentId',setUser,deleteComment)
router.delete('/delete-reply/:replyId',setUser,deleteReply)

export default router