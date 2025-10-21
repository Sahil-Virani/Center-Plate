import { useEffect, useCallback, useState } from 'react';
import { getAuth } from 'firebase/auth';
import socketService from '../services/socketService';

export const useSocket = () => {
    const auth = getAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const setupSocket = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const token = await user.getIdToken();
                    socketService.connect(token);
                    
                    // Listen for connection state
                    socketService.on('connect', () => {
                        console.log('Socket connected in hook');
                        setIsConnected(true);
                        setIsInitialized(true);
                    });

                    socketService.on('disconnect', () => {
                        console.log('Socket disconnected in hook');
                        setIsConnected(false);
                    });

                    // Check if socket is already connected
                    if (socketService.socket?.connected) {
                        console.log('Socket already connected');
                        setIsConnected(true);
                        setIsInitialized(true);
                    }
                } catch (error) {
                    console.error('Error setting up socket:', error);
                }
            }
        };

        setupSocket();

        return () => {
            socketService.disconnect();
        };
    }, [auth.currentUser]);

    const subscribe = useCallback((event, callback) => {
        if (!isInitialized) {
            console.log('Socket not initialized, waiting for initialization...');
            return () => {};
        }

        if (!isConnected) {
            console.log('Socket not connected, waiting for connection...');
            const connectHandler = () => {
                console.log('Socket connected, subscribing to event:', event);
                socketService.on(event, callback);
            };
            socketService.on('connect', connectHandler);
            return () => {
                socketService.off('connect', connectHandler);
                socketService.off(event, callback);
            };
        }
        
        console.log('Socket connected, subscribing to event:', event);
        socketService.on(event, callback);
        return () => socketService.off(event, callback);
    }, [isConnected, isInitialized]);

    const joinRoom = useCallback((roomId) => {
        if (!isInitialized) {
            console.log('Socket not initialized, waiting for initialization...');
            return () => {};
        }

        if (isConnected) {
            console.log('Joining room:', roomId);
            socketService.joinRoom(roomId);
        } else {
            console.log('Socket not connected, waiting for connection before joining room...');
            const connectHandler = () => {
                console.log('Socket connected, joining room:', roomId);
                socketService.joinRoom(roomId);
            };
            socketService.on('connect', connectHandler);
            return () => socketService.off('connect', connectHandler);
        }
    }, [isConnected, isInitialized]);

    const leaveRoom = useCallback((roomId) => {
        if (!isInitialized) {
            console.log('Socket not initialized, waiting for initialization...');
            return;
        }

        if (isConnected) {
            console.log('Leaving room:', roomId);
            socketService.leaveRoom(roomId);
        }
    }, [isConnected, isInitialized]);

    return {
        subscribe,
        joinRoom,
        leaveRoom,
        isConnected,
        isInitialized
    };
}; 