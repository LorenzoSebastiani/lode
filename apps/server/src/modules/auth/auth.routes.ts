import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { loginSchema, registerSchema } from "@lode/shared";
import { getUserById, loginUser, registerUser } from "./auth.service.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const authRouter: Router = Router();

//? POST
authRouter.post('/register', validate(registerSchema), async (req, res) => {
    await registerUser(req.body).then(()=> {
        res.status(201).json({message: 'utente registrato'})
    });
});

//? POST
authRouter.post('/login', validate(loginSchema), async (req, res)=> {
    await loginUser(req.body).then((data) => {
        res.status(200).json(data)
    })
})

//? GET
authRouter.get('/me', requireAuth, async (req, res) => {
    await getUserById(req.userId!).then((data) => {
        res.status(200).json(data)
    });
})

export default authRouter;