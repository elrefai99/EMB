import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler.utils";
import { IPayload } from "../../../@types/default";
import { authService } from "../auth.service";

export const registerController = asyncHandler(
    async (req: Request, res:Response, _next: NextFunction) => {
        const payload = req.body as IPayload

        const service = new authService()
        const result = await service.registerService(payload)

        if(result.success){
            res.cookie("pending_token", result.token, {httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 24 * 60 * 60 * 1})
            res.status(201).json({ code: 201, status: "Created", message: "User created successfully", token: result.token })
            return
        }
    }
)