import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import SessionService from '../services/sessionService';

const SessionContext = createContext();

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
      throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

export const SessionProvider = ({ children }) => {
	const [currentSession, setCurrentSession] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchSession = useCallback(async (sessionId) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.getSession(sessionId);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);


	const createSession = useCallback(async (sessionData) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.createSession(sessionData);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateSession = useCallback(async (sessionId, updateData) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.updateSession(sessionId, updateData);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteSession = useCallback(async (sessionId) => {
		setLoading(true);
		setError(null);
		try {
			await SessionService.deleteSession(sessionId);
			setCurrentSession(null);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateSessionStatus = useCallback(async (sessionId, status) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.updateSessionStatus(sessionId, status);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateSessionPreference = useCallback(async (sessionId, preference) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.updateSessionPreference(sessionId, preference);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const addParticipant = useCallback(async (sessionId, userId) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.addParticipant(sessionId, userId);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const removeParticipant = useCallback(async (sessionId, userId) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.removeParticipant(sessionId, userId);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);	
		}
	}, []);

	const updateParticipantRole = useCallback(async (sessionId, userId, role) => {
		setLoading(true);
		setError(null);	
		try {
			const session = await SessionService.updateParticipantRole(sessionId, userId, role);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);
	
	const acceptInvite = useCallback(async (sessionId, userId) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.acceptInvite(sessionId, userId);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const rejectInvite = useCallback(async (sessionId, userId) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.rejectInvite(sessionId, userId);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
		setLoading(false);
		}
	}, []);

	const updateMidpoint = useCallback(async (sessionId, midpoint) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.updateMidpoint(sessionId, midpoint);
			setCurrentSession(session);
			return session;	
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
		}, []);

	const updateParticipantLocation = useCallback(async (sessionId, userId, location) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.updateParticipantLocation(sessionId, userId, location);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);	
		}
	}, []);

	const addRestaurant = useCallback(async (sessionId, restaurant) => {
		setLoading(true);
		setError(null);
		try {
			const session = await SessionService.addRestaurant(sessionId, restaurant);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);	
		}
	}, []);

	const addRestaurants = useCallback(async (sessionId, restaurants) => {
		setLoading(true);
		setError(null);		
		try {
			const session = await SessionService.addRestaurants(sessionId, restaurants);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const voteOnRestaurant = useCallback(async (sessionId, rid, uid) => {
		setLoading(true);	
		setError(null);
		try {
			const session = await SessionService.voteOnRestaurant(sessionId, rid, uid);
			setCurrentSession(session);
			return session;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const value = {
		currentSession,
		loading,
		error,
		fetchSession,
		createSession,
		updateSession,
		deleteSession,
		updateSessionStatus,
		updateSessionPreference,
		addParticipant,
		removeParticipant,
		updateParticipantRole,
		acceptInvite,
		rejectInvite,
		updateMidpoint,
		updateParticipantLocation,
		addRestaurant,
		addRestaurants,
		voteOnRestaurant
	};

	return (
		<SessionContext.Provider value={value}>
		{children}
		</SessionContext.Provider>
	);
}; 