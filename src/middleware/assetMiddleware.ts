import { Request, Response, NextFunction } from 'express';
import path from 'path';

// Custom middleware to block .json files
export const blockJsonFiles = (req: Request, res: Response, next: NextFunction) => {
  // Extract the file extension from the requested URL path
  const ext = path.extname(req.path).toLowerCase();

  if (ext === '.json') {
    // Block the request with a 403 Forbidden status
    return res.status(403).json({ error: 'Access denied to data files.' });
  }

  next();
};