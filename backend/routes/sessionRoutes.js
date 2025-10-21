import {Router} from 'express';
import {
    createSessionController,
    getSessionByIdController,
    getAllSessionsController,
    updateSessionController,
    removeSessionController,
    updateSessionStatusController,
    updateParticipantRoleController,
    updateSessionPreferenceController,
    getAllAcceptedParticipantsController,
    getAllPendingParticipantsController,
    addParticipantController,
    removeParticipantController,
    updateMidpointController,
    addRestaurantController,
    addRestaurantsController,
    voteOnRestaurantController,
    updateParticipantLocationController
} from '../controllers/sessionControllers.js';

import{
    acceptInviteController,
    rejectInviteController
} from '../controllers/userControllers.js';

import { authenticateFirebaseToken } from '../middleware/authMiddleware.js';
import { sessionValidators } from '../middleware/validators.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticateFirebaseToken);

// Session management routes
router.post('/', sessionValidators.createSession, createSessionController);
router.get('/', getAllSessionsController);
router.get('/:sessionId', sessionValidators.getSessionById, getSessionByIdController);
router.put('/:sessionId', sessionValidators.updateSession, updateSessionController);
router.delete('/:sessionId', sessionValidators.removeSession, removeSessionController);
router.patch('/:sessionId/status', sessionValidators.updateSessionStatus, updateSessionStatusController);
router.patch('/:sessionId/preferences', sessionValidators.updateSessionPreference, updateSessionPreferenceController);


// Participant management routes
router.post('/:sessionId/participants/:uid', sessionValidators.addParticipant, addParticipantController);
router.delete('/:sessionId/participants/:uid', sessionValidators.removeParticipant, removeParticipantController);
router.patch('/:sessionId/participants/:uid/role', sessionValidators.updateParticipantRole, updateParticipantRoleController);
router.patch('/:sessionId/participants/:uid/location', sessionValidators.updateParticipantLocation, updateParticipantLocationController);

// User session management 
router.get('/:sessionId/participants/accepted', getAllAcceptedParticipantsController);
router.get('/:sessionId/participants/pending', getAllPendingParticipantsController);

// Invite management
router.post('/:sessionId/invites/:uid/accept', sessionValidators.handleInvite, acceptInviteController);
router.post('/:sessionId/invites/:uid/reject', sessionValidators.handleInvite, rejectInviteController);

// Midpoint management
router.patch('/:sessionId/midpoint', sessionValidators.updateMidpoint, updateMidpointController);

// Restaurant management
router.post('/:sessionId/restaurants', sessionValidators.addRestaurant, addRestaurantController);
router.post('/:sessionId/restaurants/bulk', sessionValidators.addRestaurants, addRestaurantsController);
router.post('/:sessionId/restaurants/:rid/vote', sessionValidators.voteOnRestaurant, voteOnRestaurantController);

export default router;
