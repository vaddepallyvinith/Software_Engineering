import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Connection from '../models/Connection.js';

// Calculate Match % based on shared university, course, and skills
const calculateMatch = (me: any, peer: any) => {
  let score = 0;
  
  // Base 20% just for being on the platform
  score += 20;

  // University match
  if (me.profile?.universityName === peer.profile?.universityName) {
    score += 20;
  }
  
  // Course match
  if (me.profile?.course === peer.profile?.course) {
    score += 30;
  }

  // Skills overlap
  const mySkills = me.profile?.skills || [];
  const peerSkills = peer.profile?.skills || [];
  
  if (mySkills.length > 0) {
    const sharedSkills = mySkills.filter((s: string) => peerSkills.includes(s));
    const skillRatio = sharedSkills.length / mySkills.length; // max 1.0
    score += Math.floor(skillRatio * 30); // max 30 points from skills
  }

  // Clamp to 100
  return Math.min(100, score);
};

export const getMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const me = await User.findById(currentUserId);
    if (!me) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get all existing connections involving this user (pending or accepted)
    const existingConnections = await Connection.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }]
    });

    // Extract all IDs representing people we already sent/received/connected with
    const excludedUserIds = new Set(existingConnections.map(c => 
      c.requester.toString() === currentUserId ? c.recipient.toString() : c.requester.toString()
    ));

    // Exclude myself
    excludedUserIds.add(currentUserId);

    // Fetch everyone else
    const potentialPeers = await User.find({ _id: { $nin: Array.from(excludedUserIds) } });

    // Calculate scores
    let matchedPeers = potentialPeers.map(peer => {
      const matchScore = calculateMatch(me, peer);
      return {
        id: peer._id,
        name: peer.name,
        location: peer.profile?.location || 'Campus',
        tags: peer.profile?.skills || [],
        match: matchScore,
        connectionStatus: 'none',
        status: 'Online' // Mocking online presence for MVP
      };
    });

    // Sort by descending match score
    matchedPeers.sort((a, b) => b.match - a.match);

    res.status(200).json(matchedPeers.slice(0, 10)); // Returns top 10 synergies
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getNetwork = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;

    // Fetch all active interactions
    const connections = await Connection.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }]
    }).populate('requester recipient', 'name profile'); // Only extract name and profile

    // Transform into frontend structured models
    const network = connections.map(conn => {
      const isRequester = conn.requester._id.toString() === currentUserId;
      const peer: any = isRequester ? conn.recipient : conn.requester;
      
      let status = 'connected';
      if (conn.status === 'pending') {
         status = isRequester ? 'sent' : 'received';
      }

      return {
        id: peer._id,
        name: peer.name,
        location: peer.profile?.location || 'Campus',
        tags: peer.profile?.skills || [],
        status: 'Online',
        connectionStatus: status,
      };
    });

    res.status(200).json(network);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const sendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
   try {
      const targetUserId = req.params.userId;
      const currentUserId = req.user!.id;

      if (targetUserId === currentUserId) {
         res.status(400).json({ message: "Cannot connect to yourself" });
         return;
      }

      // Ensure no duplicate request exists
      const existing = await Connection.findOne({
         $or: [
            { requester: currentUserId, recipient: targetUserId },
            { requester: targetUserId, recipient: currentUserId }
         ]
      });

      if (existing) {
         res.status(400).json({ message: "Connection request already exists" });
         return;
      }

      const connection = new Connection({
         requester: currentUserId,
         recipient: targetUserId,
         status: 'pending'
      });
      await connection.save();

      res.status(201).json({ message: "Request sent successfully", connection });
   } catch(err: any) {
      res.status(500).json({ message: err.message });
   }
};

export const acceptRequest = async (req: AuthRequest, res: Response): Promise<void> => {
   try {
      const peerId = req.params.userId;
      const currentUserId = req.user!.id;

      // Ensure a pending request exists where I am the recipient
      const conn = await Connection.findOne({ requester: peerId, recipient: currentUserId, status: 'pending' });
      if (!conn) {
         res.status(404).json({ message: "Pending request not found" });
         return;
      }

      conn.status = 'accepted';
      await conn.save();

      res.status(200).json({ message: "Connection accepted", connection: conn });
   } catch(err: any) {
      res.status(500).json({ message: err.message });
   }
};
