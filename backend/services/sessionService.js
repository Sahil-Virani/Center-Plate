import { Session } from "../models/Session.js";
import { User } from "../models/Users.js";
import logger from "../logger.js";
import mongoose from 'mongoose';

export async function createSession(sessionData) {
    try {
        
    
        // Ensure the creator is added as an admin participant
        const creatorParticipant = {
            user: sessionData.created_by,
            role: 'admin',
            invitation: 'accepted'
        };

        // Add creator to participants if not already present
        if (!sessionData.participants) {
            sessionData.participants = [];
        }
        
        const creatorExists = sessionData.participants.some(p => p.user === sessionData.created_by);
        if (!creatorExists) {
            sessionData.participants.push(creatorParticipant);
        }

        logger.info("Creating session with data: %j", sessionData);

        const newSession = new Session(sessionData);
        const savedSession = await newSession.save();
        
        // Populate user data for participants
        await savedSession.populate('participants.user');
        
        logger.info("Session created with id: %s", savedSession._id);
        return savedSession;
    } catch(e) {
        if (e instanceof mongoose.Error.ValidationError) {
            logger.error("Validation error creating session: %s", e.message);
            throw new Error("Invalid session data: " + e.message);
        }
        logger.error("Error creating session: %s", e.message);
        throw new Error("Error creating session: " + e.message);
    }
}

export async function getAllSessions() {
    try{
        logger.info("Getting all sessions");
        const sessions = await Session.find({});
        logger.info("Found %d sessions", sessions.length);
        return sessions;
    }catch(e){
        logger.error("Error getting all sessions: %s", e.message);
        throw new Error("Error getting all sessions: " + e.message);
    }
}

export async function getSessionById(sessionId) {
    try {
        logger.info("Getting session by id: %s", sessionId);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        const session = await Session.findById(sessionId).populate('participants.user');
        if (!session) {
            throw new Error("Session not found");
        }
        logger.info("Found session: %j", session);
        return session;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }
        logger.error("Error getting session by id: %s", e.message);
        throw new Error("Error getting session by id: " + e.message);
    }
}

export async function updateSession(sessionId, updateData) {
    try {
        logger.info("Updating session with id: %s & updateData: %j", sessionId, updateData);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        const updatedSession = await Session.findByIdAndUpdate(sessionId, updateData, { new: true }).populate('participants.user');
        if (!updatedSession) {
            throw new Error("Session not found");
        }
        logger.info("Session updated: %j", updatedSession);
        return updatedSession;
    } catch(e) {
        if (e instanceof mongoose.Error.ValidationError) {
            logger.error("Validation error updating session: %s", e.message);
            throw new Error("Invalid session data: " + e.message);
        }
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }
        logger.error("Error updating session: %s", e.message);
        throw new Error("Error updating session: " + e.message);
    }
}

export async function updateSessionPreference(sessionId, preferenceData) {
    try {
        logger.info("Updating preferences for session with id: %s & preferenceData: %j", sessionId, preferenceData);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        if (!preferenceData || typeof preferenceData !== 'object') {
            throw new Error("Invalid preference data format");
        }
        const updatedSession = await Session.findByIdAndUpdate(
            sessionId, 
            { $set: { preferences: preferenceData } },
            { new: true }
        ).populate('participants.user');

        if (!updatedSession) {
            throw new Error("Session not found");
        }
        logger.info("Session preferences updated: %j", updatedSession);
        return updatedSession;
    } catch (e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid preference data format") {
            logger.error("Invalid preference data format: %j", preferenceData);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }
        logger.error("Error updating session preferences: %s", e.message);
        throw new Error("Error updating session preferences: " + e.message);
    }
}

export async function removeSession(sessionId) {
    try {
        logger.info("Deleting session with id: %s", sessionId);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        const deletedSession = await Session.findByIdAndDelete(sessionId).populate('participants.user');
        if (!deletedSession) {
            throw new Error("Session not found");
        }
        logger.info("Session deleted: %j", deletedSession);
        return deletedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }
        logger.error("Error deleting session: %s", e.message);
        throw new Error("Error deleting session: " + e.message);
    }
}

export async function updateSessionStatus(sessionId, newStatus) {
    try {
        logger.info("Updating session status with id: %s & newStatus: %s", sessionId, newStatus);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        if (!newStatus || !['waiting', 'voting', 'finished'].includes(newStatus)) {
            throw new Error("Invalid session status");
        }
        const updatedSession = await Session.findByIdAndUpdate(sessionId, { status: newStatus }, { new: true }).populate('participants.user');
        if (!updatedSession) {
            throw new Error("Session not found");
        }
        logger.info("Session status updated: %j", updatedSession);
        return updatedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid session status") {
            logger.error("Invalid session status: %s", newStatus);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }
        logger.error("Error updating session status: %s", e.message);
        throw new Error("Error updating session status: " + e.message);
    }
}

export async function updateParticipantRole(sessionId, userId, role) {
    try {
        logger.info("Updating role for participant %s in session %s to %s", userId, sessionId, role);
        
        const updatedSession = await Session.findOneAndUpdate(
            { 
                _id: sessionId,
                'participants.user': userId
            },
            { 
                $set: { 'participants.$.role': role },
                $inc: { __v: 1 }
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedSession) {
            throw new Error("Participant not found in session");
        }

        await updatedSession.populate('participants.user');
        return updatedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid participant ID format") {
            logger.error("Invalid participant ID format: %s", userId);
            throw e;
        }
        if (e.message === "Invalid participant role") {
            logger.error("Invalid participant role: %s", role);
            throw e;
        }
        if (e.message === "Participant not found in session") {
            logger.error("Participant not found in session: %s", userId);
            throw e;
        }
        logger.error("Error updating member role: %s", e.message);
        throw new Error("Error updating member role: " + e.message);
    }
}

export async function updateParticipantLocation(sessionId, userId, location) {
    try {
        logger.info("Updating location for participant %s in session %s to %j", userId, sessionId, location);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        if (!userId || typeof userId !== 'string') {
            throw new Error("Invalid user ID format");
        }  
        if (!location || typeof location !== 'object') {
            throw new Error("Invalid location format");
        }
        if (!location.latitude || typeof location.latitude !== 'number') {
            throw new Error("Invalid latitude format");
        }
        if (!location.longitude || typeof location.longitude !== 'number') {
            throw new Error("Invalid longitude format");
        }

        const updatedSession = await Session.findOneAndUpdate(
            { 
                _id: sessionId,
                'participants.user': userId
            },
            { 
                $set: { 'participants.$.location': location },
                $inc: { __v: 1 }
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedSession) {
            throw new Error("Participant not found in session");
        }

        await updatedSession.populate('participants.user');
        return updatedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid user ID format") {
            logger.error("Invalid user ID format: %s", userId);
            throw e;
        }
        if (e.message === "Invalid location format") {
            logger.error("Invalid location format: %j", location);
            throw e;
        }
        if (e.message === "Invalid latitude format") {
            logger.error("Invalid latitude format: %f", location.latitude);
            throw e;
        }
        if (e.message === "Invalid longitude format") {
            logger.error("Invalid longitude format: %f", location.longitude);
            throw e;
        }
        if (e.message === "Participant not found in session") {
            logger.error("Participant not found in session: %s", userId);
            throw e;
        }
        logger.error("Error updating participant location: %s", e.message);
        throw new Error("Error updating participant location: " + e.message);
    }   
}

export async function getAllAcceptedParticipants(sessionId) {
    try {
        logger.info("Getting all accepted participants for session with id: %s", sessionId);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        const session = await Session.findById(sessionId);
        if (!session) {
            throw new Error("Session not found");
        }
        const acceptedParticipants = session.participants.filter(participant => participant.invitation === 'accepted');
        logger.info("Found %d accepted participants", acceptedParticipants.length);
        return acceptedParticipants;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }
        logger.error("Error getting all accepted participants: %s", e.message);
        throw new Error("Error getting all accepted participants: " + e.message);
    }
}

export async function getAllPendingParticipants(sessionId) {
    try {
        logger.info("Getting all pending participants for session with id: %s", sessionId);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        const session = await Session.findById(sessionId);
        if (!session) {
            throw new Error("Session not found");
        }
        const pendingParticipants = session.participants.filter(participant => participant.invitation === 'pending');
        logger.info("Found %d pending participants", pendingParticipants.length);
        return pendingParticipants;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }
        logger.error("Error getting all pending participants: %s", e.message);
        throw new Error("Error getting all pending participants: " + e.message);
    }
}

export async function getAllSessionsByUser(uid) {
    try {
        logger.info("Getting all sessions for user with uid: %s", uid);

        if (!uid || typeof uid !== 'string') {
            throw new Error("Invalid user ID format");
        }
        const sessions = await Session.find({ 'participants.user': uid });
        logger.info("Found %d sessions", sessions.length);
        return sessions;
    } catch(e) {
        if (e.message === "Invalid user ID format") {
            logger.error("Invalid user ID format: %s", uid);
            throw e;
        }
        logger.error("Error getting all sessions for user: %s", e.message);
        throw new Error("Error getting all sessions for user: " + e.message);
    }
}

export async function getAllAcceptedSessionsByUser(uid) {
    try {
        logger.info("Getting all accepted sessions for user with uid: %s", uid);
        if (!uid || typeof uid !== 'string') {
            throw new Error("Invalid user ID format");
        }
        const sessions = await Session.find({ 'participants.user': uid, 'participants.invitation': 'accepted' });
        logger.info("Found %d sessions", sessions.length);
        return sessions;
    } catch(e) {
        if (e.message === "Invalid user ID format") {
            logger.error("Invalid user ID format: %s", uid);
            throw e;
        }
        logger.error("Error getting all accepted sessions for user: %s", e.message);
        throw new Error("Error getting all accepted sessions for user: " + e.message);
    }
}

export async function getAllPendingSessionsByUser(uid) {
    try {
        logger.info("Getting all pending sessions for user with uid: %s", uid);
        if (!uid || typeof uid !== 'string') {
            throw new Error("Invalid user ID format");
        }
        const sessions = await Session.find({ 'participants.user': uid, 'participants.invitation': 'pending' });
        logger.info("Found %d sessions", sessions.length);
        return sessions;
    } catch(e) {
        if (e.message === "Invalid user ID format") {
            logger.error("Invalid user ID format: %s", uid);
            throw e;
        }
        logger.error("Error getting all pending sessions for user: %s", e.message);
        throw new Error("Error getting all pending sessions for user: " + e.message);
    }
}

export async function addParticipant(sessionId, userId, role = 'participant') {
    try {
        logger.info("Adding participant to session with id: %s", sessionId);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        if (!userId || typeof userId !== 'string') {
            throw new Error("Invalid user ID format");
        }
        if (!role || typeof role !== 'string') {
            throw new Error("Invalid role format");
        }

        const updatedSession = await Session.findOneAndUpdate(
            { 
                _id: sessionId,
                'participants.user': { $ne: userId } // Only add if not already a participant
            },
            { 
                $push: { 
                    participants: {
                        user: userId,
                        role: role,
                        invitation: 'pending'
                    }
                },
                $inc: { __v: 1 }
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedSession) {
            // Check if session exists
            const session = await Session.findById(sessionId);
            if (!session) {
                throw new Error("Session not found");
            }
            // If session exists but update failed, user is already a participant
            throw new Error("User is already a participant in this session");
        }

        await updatedSession.populate('participants.user');
        logger.info("Participant added: %j", updatedSession);
        return updatedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid user ID format") {
            logger.error("Invalid user ID format: %s", userId);
            throw e;
        }
        if (e.message === "Invalid role format") {
            logger.error("Invalid role format: %s", role);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }
        if (e.message === "User is already a participant in this session") {
            logger.error("User is already a participant in this session: %s", userId);
            throw e;
        }
        logger.error("Error adding participant: %s", e.message);
        throw new Error("Error adding participant: " + e.message);
    }
}

export async function removeParticipant(sessionId, uid) {
    try {
        logger.info("Removing participant with uid: %s from session with id: %s", uid, sessionId);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        if (!uid || typeof uid !== 'string') {
            throw new Error("Invalid participant ID format");
        }

        const updatedSession = await Session.findOneAndUpdate(
            { 
                _id: sessionId,
                'participants.user': uid
            },
            { 
                $pull: { participants: { user: uid } },
                $inc: { __v: 1 }
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedSession) {
            throw new Error("Participant not found in session");
        }

        await updatedSession.populate('participants.user');
        logger.info("Participant removed: %j", updatedSession);
        return updatedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid participant ID format") {
            logger.error("Invalid participant ID format: %s", uid);
            throw e;
        }
        if (e.message === "Participant not found in session") {
            logger.error("Participant not found in session: %s", uid);
            throw e;
        }
        logger.error("Error removing participant: %s", e.message);
        throw new Error("Error removing participant: " + e.message);
    }
}

export async function updateMidpoint(sessionId, midpoint) {
    try {
        logger.info("Updating midpoint for session with id: %s", sessionId);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        if (!midpoint || !midpoint.latitude || !midpoint.longitude) {
            throw new Error("Invalid midpoint data");
        }
        if (midpoint.latitude < -90 || midpoint.latitude > 90) {
            throw new Error("Invalid latitude value");
        }
        if (midpoint.longitude < -180 || midpoint.longitude > 180) {
            throw new Error("Invalid longitude value");
        }
        const updatedSession = await Session.findByIdAndUpdate(sessionId, { midpoint: midpoint }, { new: true });
        if (!updatedSession) {
            throw new Error("Session not found");
        }
        logger.info("Midpoint updated: %j", updatedSession);
        return updatedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid midpoint data") {
            logger.error("Invalid midpoint data: %j", midpoint);
            throw e;
        }
        if (e.message === "Invalid latitude value") {
            logger.error("Invalid latitude value: %f", midpoint.latitude);
            throw e;
        }
        if (e.message === "Invalid longitude value") {
            logger.error("Invalid longitude value: %f", midpoint.longitude);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }
        logger.error("Error updating midpoint: %s", e.message);
        throw new Error("Error updating midpoint: " + e.message);
    }
}

export async function addRestaurant(sessionId, restaurantData) {
    try {
        logger.info("Adding restaurant to session with id: %s", sessionId);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        if (!restaurantData || typeof restaurantData !== 'object') {
            throw new Error("Invalid restaurant data");
        }

        // Use findOneAndUpdate with atomic operation
        const updatedSession = await Session.findOneAndUpdate(
            { 
                _id: sessionId,
                'restaurants.rid': { $ne: restaurantData.rid } // Only update if restaurant doesn't exist
            },
            { 
                $push: { restaurants: restaurantData },
                $inc: { __v: 1 } // Increment version number
            },
            { 
                new: true, // Return the updated document
                runValidators: true, // Run schema validation
                upsert: false // Don't create if doesn't exist
            }
        );

        if (!updatedSession) {
            // Check if session exists
            const session = await Session.findById(sessionId);
            if (!session) {
                throw new Error("Session not found");
            }
            // If session exists but update failed, restaurant already exists
            throw new Error("Restaurant already exists in session");
        }

        await updatedSession.populate('participants.user');
        logger.info("Restaurant added to session: %j", updatedSession);
        return updatedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid restaurant data") {
            logger.error("Invalid restaurant data: %j", restaurantData);
            throw e;
        }
        if (e.message === "Restaurant already exists in session") { 
            logger.error("Restaurant already exists in session: %s", restaurantData.rid);
            throw e;
        }
        logger.error("Error adding restaurant: %s", e.message);
        throw new Error("Error adding restaurant: " + e.message);
    }
}

export async function addRestaurants(sessionId, restaurantData) {
    try {
        logger.info("Adding multiple restaurants to session with id: %s", sessionId);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");   
        }
        if (!restaurantData || !Array.isArray(restaurantData)) {
            throw new Error("Invalid restaurant data");
        }

        // Use findOneAndUpdate with atomic operation
        const updatedSession = await Session.findOneAndUpdate(
            { _id: sessionId },
            { 
                $set: { restaurants: restaurantData },
                $inc: { __v: 1 } // Increment version number
            },
            { 
                new: true, // Return the updated document
                runValidators: true, // Run schema validation
                upsert: false // Don't create if doesn't exist
            }
        );

        if (!updatedSession) {
            throw new Error("Session not found");
        }

        await updatedSession.populate('participants.user');
        logger.info("Restaurants added to session: %j", updatedSession);
        return updatedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid restaurant data") {  
            logger.error("Invalid restaurant data: %j", restaurantData);
            throw e;
        }
        if (e.message === "Session not found") {
            logger.error("Session not found with id: %s", sessionId);
            throw e;
        }   
        logger.error("Error adding restaurants: %s", e.message);
        throw new Error("Error adding restaurants: " + e.message);
    }
}

export async function voteOnRestaurant(sessionId, uid, rid) {
    try {
        logger.info("Voting on restaurant with id: %s for user with uid: %s", rid, uid);
        if (!sessionId || typeof sessionId !== 'string') {
            throw new Error("Invalid session ID format");
        }
        if (!uid || typeof uid !== 'string') {
            throw new Error("Invalid user ID format");
        }
        if (!rid || typeof rid !== 'string') {
            throw new Error("Invalid restaurant ID format");
        }

        // First check if the user has already voted for this specific restaurant
        const session = await Session.findOne({
            _id: sessionId,
            restaurants: {
                $elemMatch: {
                    rid: rid,
                    votes: uid
                }
            }
        });

        if (session) {
            throw new Error("User has already voted on this restaurant");
        }

        // If not, add the vote
        const updatedSession = await Session.findOneAndUpdate(
            { 
                _id: sessionId,
                'restaurants.rid': rid
            },
            { 
                $addToSet: { 'restaurants.$.votes': uid },
                $inc: { __v: 1 }
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedSession) {
            // Check if session exists
            const session = await Session.findById(sessionId);
            if (!session) {
                throw new Error("Session not found");
            }
            // Check if restaurant exists
            const restaurant = session.restaurants.find(r => r.rid === rid);
            if (!restaurant) {
                throw new Error("Restaurant not found in session");
            }
            // If both exist but update failed, something else went wrong
            throw new Error("Failed to add vote");
        }

        await updatedSession.populate('participants.user');
        logger.info("Restaurant voted on: %j", updatedSession);
        return updatedSession;
    } catch(e) {
        if (e.message === "Invalid session ID format") {
            logger.error("Invalid session ID format: %s", sessionId);
            throw e;
        }
        if (e.message === "Invalid user ID format") {
            logger.error("Invalid user ID format: %s", uid);    
            throw e;
        }
        if (e.message === "Invalid restaurant ID format") {
            logger.error("Invalid restaurant ID format: %s", rid);
            throw e;
        }       
        if (e.message === "Restaurant not found in session") {
            logger.error("Restaurant not found in session: %s", rid);
            throw e;
        }
        if (e.message === "User has already voted on this restaurant") {
            logger.error("User has already voted on this restaurant: %s", uid);
            throw e;
        }
        logger.error("Error voting on restaurant: %s", e.message);
        throw new Error("Error voting on restaurant: " + e.message);
    }
}