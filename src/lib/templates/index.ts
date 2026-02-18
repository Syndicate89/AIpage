import { CategoryId, CategoryTemplate } from "@/types";
import { beautyTemplate } from "./beauty";
import { healthTemplate } from "./health";
import { fashionTemplate } from "./fashion";
import { electronicsTemplate } from "./electronics";
import { foodTemplate } from "./food";
import { lifestyleTemplate } from "./lifestyle";

export const categoryTemplates: CategoryTemplate[] = [
  beautyTemplate,
  healthTemplate,
  fashionTemplate,
  electronicsTemplate,
  foodTemplate,
  lifestyleTemplate,
];

export function getTemplateById(id: CategoryId): CategoryTemplate | undefined {
  return categoryTemplates.find((t) => t.id === id);
}

export { beautyTemplate, healthTemplate, fashionTemplate, electronicsTemplate, foodTemplate, lifestyleTemplate };
