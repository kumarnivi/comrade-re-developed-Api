"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controllers/review.controller");
const router = express_1.default.Router();
router.post("/add", review_controller_1.addReview);
router.get("/:productId", review_controller_1.getReviewsByProduct);
exports.default = router;
