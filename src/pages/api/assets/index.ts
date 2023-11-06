import { fileUpload } from "@/utils/fileUpload";
import { Request, Response } from "express";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: Request, res: Response) {
  try {
    fileUpload(req, res, (error) => {
      if (error) {
        return res.status(500).send("Internal Server Error");
      }
      const files = req.files as Express.MulterS3.File[];
      const file = files[0];
      const imageUrl = file.location;
      res.status(200).json({ imageUrl });
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
}
