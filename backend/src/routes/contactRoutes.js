import { Router } from "express";
import { adminListContactMessages, adminUpdateContactMessage, createContactMessage } from "../controllers/contactController.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const r = Router();

r.post("/", createContactMessage);
r.get("/admin/messages", authRequired, adminRequired, adminListContactMessages);
r.put("/admin/messages/:id", authRequired, adminRequired, adminUpdateContactMessage);

export default r;
