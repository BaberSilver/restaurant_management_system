import { RoleName } from "@prisma/client";

declare global {
    namespace Express {
        interface UserPayload {
            userId: number;
            employeeId: number;
            role: RoleName;
        }

        interface Request {
            user: UserPayload;
        }
    }
}

export {};