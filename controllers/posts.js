import PostMessage from '../models/postMessage.js'
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        console.log(postMessages);

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
    // res.send("This Works")
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new PostMessage(post);

    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
    // res.send('Post creation')
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    //check to see if the id is a mongoose id
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("No post with that id")
    }

    const newPost = { ...post, _id } 
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, newPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that id")
    }
    await PostMessage.findByIdAndRemove(id);

    res.json({message: 'Post deleted successfuly'});
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No post with that id');
    }

    const post = await PostMessage.findById(id);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount +1 }, { new: true });

    res.json(updatedPost);
}