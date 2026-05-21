import jwt from "jsonwebtoken"
import dtenv from 'dotenv'

export default function authenticateUser(req, res, next) {

    const header = req.header("Authorization")

    if (header != null) {
        const token = header.replace("Bearer ", "")

        jwt.verify(token, ProcessingInstruction.env.JWT_SECRET,
            (err, decoded) => {
                if (decoded == null) {
                    res.status(401).json({ message: "Invalid token" })
                } else {
                    req.user = decoded
                    next()
                }
            }
        )
    } else {
        next()
    }
}