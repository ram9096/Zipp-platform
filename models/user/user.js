import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    planName: {
        type: String,
    },
    price: {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    rideLimit: {
        type: Number,
    },
    ridesUsed: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, { _id: false });


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["rider", "driver"],
        default: "rider"
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required:true
        }
    },
    isAvailable: {
        type: Boolean,
        default: false,
        required: function () {
            return this.role === "driver";
        }
    },
    isOnline: {
        type: Boolean,
        default: false,
        required: function () {
            return this.role === "driver";
        }
    },
    vehicle: {
        type: {
            type: String,
            enum: ["car", "bike", "auto"],
            required: function () {
                return this.role === "driver";
            }
        },
        model: {
            type: String,
            required: function () {
                return this.role === "driver";
            }
        },
        numberPlate: {
            type: String,
            uppercase: true,
            required: function () {
                return this.role === "driver";
            }
        }
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            required: function () {
                return this.role === "driver";
            }
        },
        count: {
            type: Number,
            default: 0,
            required: function () {
                return this.role === "driver";
            }
        }
    },

    totalRides: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    subscription: subscriptionSchema
},{timestamps:true})

userSchema.index({ location: "2dsphere" });

export const User = mongoose.model("User", userSchema);