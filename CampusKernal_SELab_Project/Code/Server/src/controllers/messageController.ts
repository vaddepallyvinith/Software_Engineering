import { Request, Response } from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';

// Extend Request interface roughly if CustomRequest isn't available from middleware here
interface AuthRequest extends Request {
  user?: any;
}

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { peerId } = req.params;
    const myId = req.user?.id;

    if (!myId || !peerId) {
      res.status(400).json({ message: 'Missing user ID parameter' });
      return;
    }

    // Find messages between these two users, sorted by oldest to newest
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: peerId },
        { sender: peerId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error retrieving messages' });
  }
};

export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const myId = req.user?.id;
    if (!myId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // To get contacts, we want all distinct peers we've conversed with.
    // Plus we will grab all users so they can start new chats (for a simple app this is fine)
    // Or we just return all users minus ourselves so they can find people.
    
    // For this lab project, returning all users minus ourselves makes chat initialization easy
    const users = await User.find({ _id: { $ne: myId } }).select('-password');
    
    // We will attach the last message for each user if it exists
    const contactsWithLastMsg = await Promise.all(
      users.map(async (user) => {
        const lastMsg = await Message.findOne({
          $or: [
            { sender: myId, receiver: user._id },
            { sender: user._id, receiver: myId },
          ],
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          sender: user._id,
          receiver: myId,
          read: false
        });

        return {
          id: user._id.toString(),
          name: user.name || 'Unknown User',
          email: user.email,
          lastMsg: lastMsg ? lastMsg.text : 'No messages yet',
          time: lastMsg ? lastMsg.createdAt : null,
          unread: unreadCount,
          online: false, // We'll handle this in socket.io later
        };
      })
    );

    res.status(200).json(contactsWithLastMsg);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error retrieving contacts' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const myId = req.user?.id;
    if (!myId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const count = await Message.countDocuments({ receiver: myId, read: false });
    res.status(200).json({ unread: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error retrieving unread count' });
  }
};
