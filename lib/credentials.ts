import type { GeneratedCredentials } from "./types"

// Normalize text for username generation
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, "") // Remove special characters
}

// Generate a random password
function generatePassword(length: number = 12): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const special = "!@#$%&*"
  
  const allChars = lowercase + uppercase + numbers + special
  
  // Ensure at least one of each type
  let password = ""
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

// Generate username from name and DNI
function generateUsername(nombre: string, apellido: string, dni: string): string {
  const normalizedNombre = normalizeText(nombre)
  const normalizedApellido = normalizeText(apellido)
  const dniSuffix = dni.slice(-4)
  
  // Take first letter of nombre and full apellido
  const username = `${normalizedNombre.charAt(0)}${normalizedApellido}${dniSuffix}`
  
  return username
}

// Main function to generate credentials
export function generateCredentials(
  nombre: string,
  apellido: string,
  dni: string
): GeneratedCredentials {
  const nombreApellido = `${nombre.trim()} ${apellido.trim()}`
  const username = generateUsername(nombre, apellido, dni)
  const password = generatePassword(12)
  
  return {
    nombreApellido,
    username,
    password
  }
}

// Validate DNI format (8 digits for Argentina)
export function validateDni(dni: string): boolean {
  return /^\d{7,8}$/.test(dni)
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
