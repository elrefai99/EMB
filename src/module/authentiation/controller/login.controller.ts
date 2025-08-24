import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler.utils";
import { IPayload } from "../../../@types/default";
import { authService } from "../auth.service";

export const loginController = asyncHandler(
    async (req: Request, res:Response, _next: NextFunction) => {
        const payload = req.body as IPayload

        const service = new authService()
        const result = await service.loginService(payload)

        if(result.success){
            res.cookie("access_token", result.token, {httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 24 * 60 * 60 * 1})
            res.cookie("refresh_token", result.refresh_Token, {httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 24 * 60 * 60 * 1})
            res.status(200).json({ code: 200, status: "OK", message: "Success login from user", token: result.token })
            return
        }
    }
)