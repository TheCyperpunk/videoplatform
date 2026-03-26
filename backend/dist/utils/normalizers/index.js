"use strict";
/**
 * Universal Normalizer Index
 *
 * Usage:
 *   import { normalize } from "../utils/normalizers";
 *   const doc = normalize(rawRow, "assoass");
 *
 * Supported sourceTypes:
 *   "assoass"           → assoass.json (array rows, 11 fields)
 *   "dinotube"          → dinotube (2).json (array rows, 11 fields)
 *   "uncutmaza-simple"  → uncutmaza.json (array rows, 4 fields, no thumb)
 *   "uncutmaza-rich"    → uncutmaza-com-co-*.json (objects with named fields)
 *   "desihub"           → desihub.json (array rows, 3 fields)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = normalize;
exports.detectSourceType = detectSourceType;
const normalizeAssoass_1 = require("./normalizeAssoass");
const normalizeDinotube_1 = require("./normalizeDinotube");
const normalizeUncutmazaSimple_1 = require("./normalizeUncutmazaSimple");
const normalizeUncutmazaRich_1 = require("./normalizeUncutmazaRich");
const normalizeDesihub_1 = require("./normalizeDesihub");
function normalize(raw, sourceType) {
    switch (sourceType) {
        case "assoass": return (0, normalizeAssoass_1.normalizeAssoass)(raw);
        case "dinotube": return (0, normalizeDinotube_1.normalizeDinotube)(raw);
        case "uncutmaza-simple": return (0, normalizeUncutmazaSimple_1.normalizeUncutmazaSimple)(raw);
        case "uncutmaza-rich": return (0, normalizeUncutmazaRich_1.normalizeUncutmazaRich)(raw);
        case "desihub": return (0, normalizeDesihub_1.normalizeDesihub)(raw);
        default:
            throw new Error(`Unknown sourceType: "${sourceType}". Valid types: assoass, dinotube, uncutmaza-simple, uncutmaza-rich, desihub`);
    }
}
/**
 * Auto-detect source type from filename.
 * Falls back to "assoass" if unrecognized.
 */
function detectSourceType(filename) {
    const f = filename.toLowerCase();
    if (f.includes("desihub"))
        return "desihub";
    if (f.includes("dinotube"))
        return "dinotube";
    if (f.includes("uncutmaza") && f.includes("-2"))
        return "uncutmaza-rich";
    if (f.includes("uncutmaza-com-co"))
        return "uncutmaza-rich";
    if (f.includes("uncutmaza"))
        return "uncutmaza-simple";
    if (f.includes("assoass"))
        return "assoass";
    return "assoass"; // default fallback
}
