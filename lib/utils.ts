import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImg = (image: string)=>{
  return (`https://bazario-backend-vmlz.onrender.com${image}`)
}