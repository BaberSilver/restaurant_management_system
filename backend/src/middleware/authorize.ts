import { Request, Response, NextFunction } from "express";

export function authorize(...roles: string[]) {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        if (!req.user)
            return res.sendStatus(401);

        if (!roles.includes(req.user.role))
            return res.sendStatus(403);

        next();

    };

}