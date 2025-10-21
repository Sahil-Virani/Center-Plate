import { 
    deleteUser,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { auth } from './firebaseConfig.js';
import UserService from '../services/userService';

const getFirebaseErrorMessage = (error) => {
    switch (error.code) {
		case 'auth/invalid-credential':
			return 'Invalid email or password. Please try again.';
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please use a different email or login.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'This operation is not allowed. Please contact support.';
        case 'auth/weak-password':
            return 'Please choose a stronger password (at least 6 characters).';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';
        default:
            return error.message;
    }
};

export const signup = async (email, password, username) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, { displayName: username });
        
        const user = auth.currentUser;
        try {
            await UserService.createUser({
                _id: user.uid,
                username: user.displayName,
                email: user.email
            });
            return user;
        } catch (error) {
            try {
                await deleteUser(user);
                await signOut(auth);
            } catch (cleanupError) {
                throw new Error('Failed to clean up after database error. Please try again.');
            }
            throw new Error('Failed to create user profile. Please try again.');
        }
    } catch (error) {
        throw new Error(getFirebaseErrorMessage(error));
    }
};
  
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(getFirebaseErrorMessage(error));
    }
};
  
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error('Failed to logout. Please try again.');
    }
};

export const updateUsername = async (username) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is currently logged in.');
    }

    const oldUsername = user.displayName;
    try {
        await updateProfile(user, { displayName: username });
        
        try {
            await UserService.updateUser(user.uid, { username });
            return user;
        } catch (error) {
            await updateProfile(user, { displayName: oldUsername });
            throw new Error('Failed to update username. Please try again.');
        }
    } catch (error) {
        throw new Error('Failed to update username. Please try again.');
    }
};
  
export const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        throw new Error(getFirebaseErrorMessage(error));
    }
};
 
export const remove = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is currently logged in.');
    }

    try {
        await deleteUser(user);
        
        try {
            await UserService.deleteUser(user.uid);
        } catch (error) {
            console.error('Failed to delete user from database:', error);
        }
    } catch (error) {
        throw new Error('Failed to delete account. Please try again.');
    }
};