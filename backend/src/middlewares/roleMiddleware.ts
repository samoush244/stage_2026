import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        message: "Accès refusé",
      });
    }

    next();
  };
};