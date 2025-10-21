import {
    createSession,
    getAllSessions,
    getSessionById,
    updateSession,
    removeSession,
    updateSessionStatus,
    updateParticipantRole,
    updateSessionPreference,
    getAllAcceptedParticipants,
    getAllPendingParticipants,
    getAllSessionsByUser,
    getAllAcceptedSessionsByUser,
    getAllPendingSessionsByUser,
    addParticipant,
    removeParticipant,
    updateParticipantLocation,
    updateMidpoint,
    addRestaurant,
    addRestaurants,
    voteOnRestaurant
} from '../services/sessionService.js';

import logger from '../logger.js';

export async function createSessionController(req, res) {
    try {
        const { name, participants, preferences } = req.body;   
        const created_by = req.user._id;

        logger.info("Creating session with data: %j", req.body);
        let sessionData = { 
            name, 
            created_by,
            participants: participants || [],
            preferences: preferences || {}
        };

        logger.info("Session data: %j", sessionData);
        const session = await createSession(sessionData);

    
        // Send invites to participants
        for (let participant of session.participants) {
            if (participant.user._id === created_by) {
                continue;
            }
            console.log("Sending session created event to participant: %s", participant.user._id);
            req.io.to(participant.user._id).emit('sessionCreated', session);
        }
    
        res.status(201).json(session);
    } catch (e) {
        logger.error("Error in createSessionController: %s", e.message);
        if (e.name === 'ValidationError') {
            return res.status(400).json({ 
                error: "Validation Error",
                details: e.message 
            });
        }
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function getAllSessionsController(req, res) {
    try {
        const sessions = await getAllSessions();
        res.status(200).json(sessions);
    } catch (e) {
        logger.error("Error in getAllSessionsController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function getSessionByIdController(req, res) {
    try {
        const { sessionId } = req.params;
        const session = await getSessionById(sessionId);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }
        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in getSessionByIdController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function updateSessionController(req, res) {
    try {
        const { sessionId } = req.params;
        const updateData = req.body;
        const session = await updateSession(sessionId, updateData);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }

        req.io.to(sessionId).emit('sessionUpdated', session);

        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in updateSessionController: %s", e.message);
        if (e.name === 'ValidationError') {
            return res.status(400).json({ 
                error: "Validation Error",
                details: e.message 
            });
        }
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function removeSessionController(req, res) {
    try {
        const { sessionId } = req.params;
        const session = await removeSession(sessionId);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }

        for (let participant of session.participants) {
            if (participant.user._id === req.user._id) {
                continue;
            }
            console.log("Sending session deleted event to participant: %s", participant.user._id);
            req.io.to(participant.user._id).emit('sessionDeleted', session);
        }

        req.io.to(sessionId).emit('sessionDeleted', session);

        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in removeSessionController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function updateSessionStatusController(req, res) {
    try {
        const { sessionId } = req.params;
        const { status } = req.body;
        const session = await updateSessionStatus(sessionId, status);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }

        // Emit session status updated event
        req.io.to(sessionId).emit('sessionUpdated', session);

        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in updateSessionStatusController: %s", e.message);
        if (e.name === 'ValidationError') {
            return res.status(400).json({ 
                error: "Validation Error",
                details: e.message 
            });
        }
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function updateSessionPreferenceController(req, res) {
    try {
        const { sessionId } = req.params;
        const preferences = req.body;
        const session = await updateSessionPreference(sessionId, preferences);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }

        req.io.to(sessionId).emit('sessionUpdated', session);

        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in updateSessionPreferenceController: %s", e.message);
        if (e.name === 'ValidationError') {
            return res.status(400).json({ 
                error: "Validation Error",
                details: e.message 
            });
        }
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}


export async function getAllAcceptedParticipantsController(req, res) {
    try {
        const { sessionId } = req.params;
        const participants = await getAllAcceptedParticipants(sessionId);
        if (!participants) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }
        res.status(200).json(participants);
    } catch (e) {
        logger.error("Error in getAllAcceptedParticipantsController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function getAllPendingParticipantsController(req, res) {
    try {
        const { sessionId } = req.params;
        const participants = await getAllPendingParticipants(sessionId);
        if (!participants) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }
        res.status(200).json(participants);
    } catch (e) {
        logger.error("Error in getAllPendingParticipantsController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function getAllSessionsByUserController(req, res) {
    try {
        const sessions = await getAllSessionsByUser(req.user._id);
        res.status(200).json(sessions);
    } catch (e) {
        logger.error("Error in getAllSessionsByUserController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function getAllAcceptedSessionsByUserController(req, res) {
    try {
        const sessions = await getAllAcceptedSessionsByUser(req.user._id);
        res.status(200).json(sessions);
    } catch (e) {
        logger.error("Error in getAllAcceptedSessionsByUserController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function getAllPendingSessionsByUserController(req, res) {
    try {
        const sessions = await getAllPendingSessionsByUser(req.user._id);
        res.status(200).json(sessions);
    } catch (e) {
        logger.error("Error in getAllPendingSessionsByUserController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function addParticipantController(req, res) {
    try {
        const { sessionId, uid } = req.params;
        const { role } = req.body;
        const session = await addParticipant(sessionId, uid, role);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }

        // Notify the new participant
        req.io.to(uid).emit('newSessionCreated', session);
        req.io.to(sessionId).emit('sessionUpdated', session);

        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in addParticipantController: %s", e.message);
        if (e.message === "Session not found") {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }
        if (e.message === "User is already a participant in this session") {
            return res.status(400).json({ 
                error: "Bad Request",
                details: e.message 
            });
        }
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function removeParticipantController(req, res) {
    try {
        const { sessionId, uid } = req.params;
        const session = await removeParticipant(sessionId, uid);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session or participant not found" 
            });
        }

        req.io.to(sessionId).emit('sessionUpdated', session);
        req.io.to(uid).emit('sessionRemoved', session);
        

        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in removeParticipantController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}

export async function updateParticipantRoleController(req, res) {
    try {
        const { sessionId, uid } = req.params;
        const { role } = req.body;

        const session = await updateParticipantRole(sessionId, uid, role);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }

        req.io.to(sessionId).emit('sessionUpdated', session);

        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in updateParticipantRoleController: %s", e.message);
        if (e.message === "Session not found") {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }
        if (e.message === "Participant not found in session") {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Participant not found in session" 
            });
        }
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}   

export async function updateParticipantLocationController(req, res) {
    try {
        const { sessionId, uid } = req.params;
        const { location } = req.body;  

        const session = await updateParticipantLocation(sessionId, uid, location);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }  
        req.io.to(sessionId).emit('sessionUpdated', session);

        res.status(200).json(session);  
    } catch (e) {
        logger.error("Error in updateParticipantLocationController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }

}

export async function updateMidpointController(req, res) {
    try {
        const { sessionId } = req.params;
        const { midpoint } = req.body;
        const session = await updateMidpoint(sessionId, midpoint);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }
        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in updateMidpointController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}


export async function addRestaurantController(req, res) {
    try {
        const { sessionId } = req.params;
        const { restaurant } = req.body;
        const session = await addRestaurant(sessionId, restaurant); 
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }
        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in addRestaurantController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
        }
}

export async function addRestaurantsController(req, res) {
    try {
        const { sessionId } = req.params;
        const { restaurants } = req.body;
        const session = await addRestaurants(sessionId, restaurants);
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }
        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in addRestaurantsController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}   

export async function voteOnRestaurantController(req, res) {
    try {
        const { sessionId, rid } = req.params;
        const { uid } = req.body;
        const session = await voteOnRestaurant(sessionId, uid, rid);    
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "Session not found" 
            });
        }   
        req.io.to(sessionId).emit('sessionUpdated', session);
        res.status(200).json(session);
    } catch (e) {
        logger.error("Error in voteOnRestaurantController: %s", e.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message 
        });
    }
}       
