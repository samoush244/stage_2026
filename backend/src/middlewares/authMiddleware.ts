import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    isActive?: boolean;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Accès refusé, token manquant",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET manquant dans le fichier .env",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Utilisateur non trouvé",
      });
    }
    if (!user.isActive) {
      return res.status(403).json({
        message: "Compte utilisateur désactivé",
      });
    }
    req.user = {
      id: user._id.toString(),
      roles: user.roles,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide ou expiré",
    });
  }
};
