import FriendReq from "../models/friendReq.model.js";
import User from "../models/user.model.js";


import { handleCustomError, handleServerError } from "../utils/error.js"

export const getRecommendedUsers = async (req, res)=>{
  try{
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        {_id: {$ne: currentUserId}},
        {$id: {$nin: currentUser.friends}},
        {isVerified: true}
      ]
    });
    res.status(200).json(recommendedUsers);
  }catch(error){
    return handleServerError(res, error);
  }
}

export const getFriends = async (req, res)=>{
  try{
    const user = await User.findById(req.user.id)
    .select("friends")
    .populate("friends", "username avatar nativeLanguage location bio");

    res.status(200).json(user.friends);
  }catch(error){
    return handleServerError(res, error);
  }
}

export const sendFriendReq = async (req, res)=>{
  try{
    const senderId = req.user.id;
    const { id:receiverId } = req.params;

    if(senderId === receiverId){
      return handleCustomError(res, 402, "You cannout send a friend request to yourself");
    }

    const receiver = await User.findById(receiverId);
    if(!receiver){
      return handleCustomError(res, 404, "Receiver not Found");
    }

    if(receiver.friends.includes(senderId)){
      return handleCustomError(res, 400, "You cannot send a friend Request to someone you are already friends with.");
    }

    const existingFriendRequest = await FriendReq.findOne({
      $or: [
        {sender: senderId, receiver: receiverId},
        {sender: receiverId, receiver: senderId},
      ]
    });

    if(existingFriendRequest){
      return handleCustomError(res, 409, "A pending friend Request exists already");
    }

    const friendReq = await FriendReq.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(200).json(friendReq);
  }catch(error){
    return handleServerError(res, error);
  }
}

export const acceptFriendReq = async (req, res)=>{
  try{
    const { id: requestId } = req.params;
    const friendRequest = await FriendReq.findById(requestId);

    if(!friendRequest){
      return handleCustomError(res, 404, "Request Not Found");
    }

    if(friendRequest.receiver.toString() !== req.user.id){
      return handleCustomError(res, 403, "You are not authorized to accept this request.");
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: {friends: friendRequest.receiver},
    });

    await User.findByIdAndUpdate(friendRequest.receiver, {
      $addToSet: {friends: friendRequest.sender}
    });

    res.status(201).json({message: "Friend Request Accepted"});
  }catch(error){
    return handleServerError(readFileAsArrayBuffer, error);
  }
}

export const getFriendRequests = async (req, res)=>{
  try{
    const incomingFriendReq = await FriendReq.find({
      receiver: req.user.id,
      status: "pending"
    }).populate("sender", "username avatar nativeLanguage location");

    const acceptedReq = await FriendReq.find({
      sender: req.user.id,
      status: "accepted"
    }).populate("receiver", "username avatar");

    res.status(200).json({incomingFriendReq, acceptedReq});

  }catch(error){
    return handleServerError(res, error);
  }
}

export const getOutgoingFriendRequests = async (req, res)=>{
  try{
    const outgoingRequests = await FriendReq.find({
      sender: req.user.id,
      status: "pending",
    }).populate("receiver", "username avatar nativeLanguage location");

    res.status(200).json(outgoingRequests);
  }catch(error){
    return handleServerError(res, error);
  }
}