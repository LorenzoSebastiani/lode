import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { registerSchema } from "@lode/shared";
import { registerUser } from "./auth.service.js";

const authRouter: Router = Router();

//? POST
authRouter.post('', validate(registerSchema), async (req, res) => {
    await registerUser(req.body).then(()=> {
        res.status(201).json({message: 'utente registrato'})
    });
});

export default authRouter;