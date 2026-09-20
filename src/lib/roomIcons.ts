import type { LucideIcon } from "lucide-react"
import {
  Armchair,
  Baby,
  Bath,
  Bed,
  BedDouble,
  Boxes,
  Briefcase,
  Building2,
  Car,
  ChefHat,
  CircleHelp,
  CookingPot,
  DoorOpen,
  Droplets,
  Dumbbell,
  Flower2,
  House,
  Lamp,
  Laptop,
  Monitor,
  Package,
  ShowerHead,
  Sofa,
  Sun,
  Trees,
  Tv,
  Utensils,
  Warehouse,
  WashingMachine,
} from "lucide-react"

export type RoomIconCategory = "General" | "Living" | "Bedroom" | "Kitchen & Dining" | "Bathroom" | "Workspace" | "Outdoor" | "Garage & Fitness" | "Kids & Storage"

export interface RoomIconOption {
  name: string
  label: string
  category: RoomIconCategory
  keywords: string[]
  icon: LucideIcon
}

export const ROOM_ICON_OPTIONS: RoomIconOption[] = [
  { name: "house", label: "House", category: "General", keywords: ["home", "room"], icon: House },
  { name: "building", label: "Building", category: "General", keywords: ["home", "office"], icon: Building2 },
  { name: "door-open", label: "Door Open", category: "General", keywords: ["entry", "entrance"], icon: DoorOpen },
  { name: "sofa", label: "Sofa", category: "Living", keywords: ["living", "lounge", "seat"], icon: Sofa },
  { name: "armchair", label: "Armchair", category: "Living", keywords: ["living", "chair", "seat"], icon: Armchair },
  { name: "tv", label: "TV", category: "Living", keywords: ["living", "media", "entertainment"], icon: Tv },
  { name: "bed", label: "Bed", category: "Bedroom", keywords: ["bedroom", "sleep"], icon: Bed },
  { name: "bed-double", label: "Bed Double", category: "Bedroom", keywords: ["bedroom", "sleep"], icon: BedDouble },
  { name: "lamp", label: "Lamp", category: "Bedroom", keywords: ["bedroom", "light", "nightstand"], icon: Lamp },
  { name: "chef-hat", label: "Chef Hat", category: "Kitchen & Dining", keywords: ["kitchen", "cook", "cooking"], icon: ChefHat },
  { name: "cooking-pot", label: "Cooking Pot", category: "Kitchen & Dining", keywords: ["kitchen", "cook", "cooking"], icon: CookingPot },
  { name: "utensils", label: "Utensils", category: "Kitchen & Dining", keywords: ["kitchen", "dining", "cook"], icon: Utensils },
  { name: "bath", label: "Bath", category: "Bathroom", keywords: ["bathroom", "wash"], icon: Bath },
  { name: "shower-head", label: "Shower", category: "Bathroom", keywords: ["bathroom", "wash"], icon: ShowerHead },
  { name: "droplets", label: "Water", category: "Bathroom", keywords: ["bathroom", "humidity", "wash"], icon: Droplets },
  { name: "laptop", label: "Laptop", category: "Workspace", keywords: ["work", "office", "desk"], icon: Laptop },
  { name: "monitor", label: "Monitor", category: "Workspace", keywords: ["work", "office", "desk"], icon: Monitor },
  { name: "briefcase", label: "Briefcase", category: "Workspace", keywords: ["work", "office", "business"], icon: Briefcase },
  { name: "trees", label: "Trees", category: "Outdoor", keywords: ["garden", "outside", "nature"], icon: Trees },
  { name: "flower", label: "Flower", category: "Outdoor", keywords: ["garden", "outside", "plant"], icon: Flower2 },
  { name: "sun", label: "Sun", category: "Outdoor", keywords: ["garden", "outside", "balcony"], icon: Sun },
  { name: "car", label: "Car", category: "Garage & Fitness", keywords: ["garage", "vehicle"], icon: Car },
  { name: "warehouse", label: "Warehouse", category: "Garage & Fitness", keywords: ["garage", "storage"], icon: Warehouse },
  { name: "dumbbell", label: "Dumbbell", category: "Garage & Fitness", keywords: ["fitness", "gym", "workout"], icon: Dumbbell },
  { name: "baby", label: "Baby", category: "Kids & Storage", keywords: ["kids", "child", "nursery"], icon: Baby },
  { name: "boxes", label: "Boxes", category: "Kids & Storage", keywords: ["storage", "closet"], icon: Boxes },
  { name: "package", label: "Package", category: "Kids & Storage", keywords: ["storage", "delivery"], icon: Package },
  { name: "washing-machine", label: "Washing Machine", category: "Kids & Storage", keywords: ["laundry", "utility"], icon: WashingMachine },
]

const ROOM_ICON_MAP = new Map(ROOM_ICON_OPTIONS.map((option) => [option.name, option]))
const ROOM_ICON_ALIASES: Record<string, string> = {
  home: "house",
  plant: "flower",
}

export function getRoomIconOption(name: string | undefined): RoomIconOption {
  const normalizedName = name?.trim().toLowerCase() ?? ""
  return ROOM_ICON_MAP.get(ROOM_ICON_ALIASES[normalizedName] ?? normalizedName) ?? ROOM_ICON_OPTIONS[0]
}

export function formatRoomIconName(name: string | undefined): string {
  return getRoomIconOption(name).label
}

export const ROOM_ICON_FALLBACK = CircleHelp
