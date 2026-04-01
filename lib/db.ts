// Mock database for demonstration purposes
// In production, this would be replaced with actual Prisma client calls

import type { User, FileRecord, FileType } from "./types"

// In-memory storage (simulating database)
const users: Map<string, User> = new Map()
const files: Map<string, FileRecord> = new Map()

// Helper to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

// User operations
export async function createUser(data: Omit<User, "id" | "createdAt" | "updatedAt" | "files">): Promise<User> {
  const id = generateId()
  const now = new Date()
  
  const user: User = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
    files: []
  }
  
  users.set(id, user)
  return user
}

export async function getUserById(id: string): Promise<User | null> {
  const user = users.get(id)
  if (!user) return null
  
  // Attach files
  const userFiles = Array.from(files.values()).filter(f => f.userId === id)
  return { ...user, files: userFiles }
}

export async function getUserByDni(dni: string): Promise<User | null> {
  const user = Array.from(users.values()).find(u => u.dni === dni)
  if (!user) return null
  
  const userFiles = Array.from(files.values()).filter(f => f.userId === user.id)
  return { ...user, files: userFiles }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const user = Array.from(users.values()).find(u => u.username === username)
  if (!user) return null
  
  const userFiles = Array.from(files.values()).filter(f => f.userId === user.id)
  return { ...user, files: userFiles }
}

export async function searchUsers(query: string): Promise<User[]> {
  const lowercaseQuery = query.toLowerCase()
  
  return Array.from(users.values()).filter(user => {
    return (
      user.nombre.toLowerCase().includes(lowercaseQuery) ||
      user.apellido.toLowerCase().includes(lowercaseQuery) ||
      user.dni.includes(query) ||
      user.username.toLowerCase().includes(lowercaseQuery)
    )
  }).map(user => {
    const userFiles = Array.from(files.values()).filter(f => f.userId === user.id)
    return { ...user, files: userFiles }
  })
}

export async function getAllUsers(): Promise<User[]> {
  return Array.from(users.values()).map(user => {
    const userFiles = Array.from(files.values()).filter(f => f.userId === user.id)
    return { ...user, files: userFiles }
  })
}

export async function deleteUser(id: string): Promise<boolean> {
  // Delete all user files first
  Array.from(files.values())
    .filter(f => f.userId === id)
    .forEach(f => files.delete(f.id))
  
  return users.delete(id)
}

export async function checkDniExists(dni: string): Promise<boolean> {
  return Array.from(users.values()).some(u => u.dni === dni)
}

// File operations
export async function createFile(data: Omit<FileRecord, "id" | "createdAt" | "updatedAt">): Promise<FileRecord> {
  const id = generateId()
  const now = new Date()
  
  const file: FileRecord = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now
  }
  
  files.set(id, file)
  return file
}

export async function getFileById(id: string): Promise<FileRecord | null> {
  return files.get(id) || null
}

export async function getFilesByUserId(userId: string): Promise<FileRecord[]> {
  return Array.from(files.values()).filter(f => f.userId === userId)
}

export async function getFilesByUserIdAndType(userId: string, tipo: FileType): Promise<FileRecord[]> {
  return Array.from(files.values()).filter(f => f.userId === userId && f.tipo === tipo)
}

export async function deleteFile(id: string): Promise<boolean> {
  return files.delete(id)
}

export async function deleteFilesByUserId(userId: string): Promise<number> {
  const userFiles = Array.from(files.values()).filter(f => f.userId === userId)
  userFiles.forEach(f => files.delete(f.id))
  return userFiles.length
}
