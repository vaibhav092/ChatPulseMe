import {asyncHandler} from '../Util/asyncHandler.js';
import jwt from 'jsonwebtoken';
import {User} from '../Models/user.Model.js';

export const verifyjwt = asyncHandler(async (req, res, next) => {

    const token=req.cookies?.accessToken || req.headers?.authorization || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new Error("token not found ")
    }

    const decoded=jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded?.id).select('-password -refreshToken');

    if (!user) {
        return new Error('Invalid token');
    }
    req.user = user;
    next();
})