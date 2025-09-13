import { z } from "zod";
// Enums
export const CityEnum = z.enum([
  "Chandigarh",
  "Mohali",
  "Zirakpur",
  "Panchkula",
  "Other",
]);
export const PropertyTypeEnum = z.enum([
  "Apartment",
  "Villa",
  "Plot",
  "Office",
  "Retail",
]);
export const BHKEnum = z.enum(["BHK1", "BHK2", "BHK3", "BHK4", "Studio"]);

export const PurposeEnum = z.enum(["Buy", "Rent"]);
export const TimelineEnum = z.enum([
  "ZERO_TO_THREE_MONTHS",
  "THREE_TO_SIX_MONTHS",
  "MORE_THAN_SIX_MONTHS",
  "EXPLORING",
]);

export const SourceEnum = z.enum([
  "Website",
  "Referral",
  "Walk_in",
  "Call",
  "Other",
]);
export const StatusEnum = z.enum([
  "New",
  "Qualified",
  "Contacted",
  "Visited",
  "Negotiation",
  "Converted",
  "Dropped",
]);

// Base buyer schema
export const baseBuyerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d{10,15}$/, "Phone must be 10-15 digits")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits"),
  city: CityEnum,
  propertyType: PropertyTypeEnum,
  bhk: BHKEnum.optional(),
  purpose: PurposeEnum,
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: TimelineEnum,
  source: SourceEnum,
  status: StatusEnum.default("New"),
  notes: z
    .string()
    .max(1000, "Notes must be at most 1000 characters")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string()).optional().default([]),
});

// Query/filter schema for listing buyers
export const buyerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  city: CityEnum.optional(),
  propertyType: PropertyTypeEnum.optional(),
  status: StatusEnum.optional(),
  timeline: TimelineEnum.optional(),
  sortBy: z.enum(["fullName", "updatedAt", "createdAt"]).default("updatedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Types

export type BuyerQueryInput = z.infer<typeof buyerQuerySchema>;
