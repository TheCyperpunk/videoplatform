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

import { normalizeAssoass }        from "./normalizeAssoass";
import { normalizeDinotube }        from "./normalizeDinotube";
import { normalizeUncutmazaSimple } from "./normalizeUncutmazaSimple";
import { normalizeUncutmazaRich }   from "./normalizeUncutmazaRich";
import { normalizeDesihub }         from "./normalizeDesihub";

export type SourceType =
    | "assoass"
    | "dinotube"
    | "uncutmaza-simple"
    | "uncutmaza-rich"
    | "desihub";

export function normalize(raw: any, sourceType: SourceType): object {
    switch (sourceType) {
        case "assoass":          return normalizeAssoass(raw);
        case "dinotube":         return normalizeDinotube(raw);
        case "uncutmaza-simple": return normalizeUncutmazaSimple(raw);
        case "uncutmaza-rich":   return normalizeUncutmazaRich(raw);
        case "desihub":          return normalizeDesihub(raw);
        default:
            throw new Error(`Unknown sourceType: "${sourceType}". Valid types: assoass, dinotube, uncutmaza-simple, uncutmaza-rich, desihub`);
    }
}

/**
 * Auto-detect source type from filename.
 * Falls back to "assoass" if unrecognized.
 */
export function detectSourceType(filename: string): SourceType {
    const f = filename.toLowerCase();
    if (f.includes("desihub"))                          return "desihub";
    if (f.includes("dinotube"))                         return "dinotube";
    if (f.includes("uncutmaza") && f.includes("-2"))    return "uncutmaza-rich";
    if (f.includes("uncutmaza-com-co"))                 return "uncutmaza-rich";
    if (f.includes("uncutmaza"))                        return "uncutmaza-simple";
    if (f.includes("assoass"))                          return "assoass";
    return "assoass"; // default fallback
}
