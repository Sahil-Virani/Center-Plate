import mongoose from "mongoose";
import shortid from 'shortid';

const ParticipantSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },

    location: {
        latitude: {
            type: Number,
            default: null
        },
        longitude: {
            type: Number,   
            default: null
        }
    },

    invitation: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    
    role: {
        type: String,
        enum: ['admin', 'participant'],
        default: 'participant'
    }
}, { _id: false });

const RestaurantSchema = new mongoose.Schema({
    rid:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,   
    },
    coordinates:{
        type: [Number],
        required: true
    },
    address:{
        type: String,
        required: false,
        default: "",
    },
    images:{
        type: [String],
        required: false,
        default: [],
    },
    categories:{
        type: [String],
        required: false,
        default: [],
    },
    votes:{
        type: [String],
        required: false,
        default: [],
    }
},{ _id: false });

const SessionSchema = new mongoose.Schema({
    _id: {type: String, default: shortid.generate },
    name:{
        type: String,
        required: true
    },
    created_by:{
        type: String,
        ref: 'User',
        required: true
    },
    participants: [ParticipantSchema],
    status: {
        type: String,
        enum: ['waiting', 'voting', 'finished'],
        default: 'waiting'
    },
    midpoint: {
        latitude: {
            type: Number,
            default: null
        },
        longitude: {
            type: Number,
            default: null
        }
    },
    preferences: {
        dietaryValue: {
            type: String,
            default: null
        },
        priceValue: {
            type: String,
            default: null
        },
        cuisineValue: {
            type: String,
            default: null
        },
        includeParking: {
            type: Boolean,
            default: false
        },
        includeTransport: {
            type: Boolean,
            default: false
        }
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    restaurants: [RestaurantSchema]
});

export const Session = mongoose.model("Session", SessionSchema);
