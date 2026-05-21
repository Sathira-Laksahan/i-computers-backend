import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser(req, res) {

    try {

        const password = req.body.password;

        const passwordHash = bcrypt.hashSync(password, 10);

        const user = new User(
            {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: passwordHash
            }
        );

        await user.save();

        res.json({ message: "User created successfully" });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.json({ message: "Internal server error" });
    }


}

export async function logingUser(req, res) {
    try {

        const email = req.body.email;
        const password = req.body.password

        const user = await User.findOne({ email: email })

        if (user == null) {
            res.status(404).json({ message: "User is not found" })
            return
        }

        const isPasswordMatching = bcrypt.compareSync(password, user.password)

        if (isPasswordMatching) {
            //res.json({ message: "User logined successfully" })

            const userInfo = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                isEmailVerified: user.isEmailVerified,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked
            }
            const token = jwt.sign(userInfo, "Key")

            console.log("Generated Token:", token)
            res.json({ token: token })

        } else {
            res.status(401).json({ message: "Invalid credentials" })
        }

    } catch (error) {
        console.error("Error login user:", error);
        return res.json({ message: "Internal server error" });
    }
}


export function isAdmin(req) {
    if (req.user == null) {
        return false
    }

    if (!req.user.isAdmin) {
        return false
    }
    return true
}