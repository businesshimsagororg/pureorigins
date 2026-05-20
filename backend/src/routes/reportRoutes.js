import { Router } from "express";
import { customerReport, salesReport, stockReport } from "../controllers/reportController.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const r = Router();
r.get("/admin/reports/sales", authRequired, adminRequired, salesReport);
r.get("/admin/reports/stock", authRequired, adminRequired, stockReport);
r.get("/admin/reports/customers", authRequired, adminRequired, customerReport);

export default r;