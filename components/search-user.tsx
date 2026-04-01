"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, User, ChevronRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { User as UserType } from "@/lib/types"

interface SearchUserProps {
  onUserSelect?: (user: UserType) => void
}

export function SearchUser({ onUserSelect }: SearchUserProps) {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const searchUsers = useCallback(async (searchQuery: string) => {
    setIsLoading(true)

    try {
      const url = searchQuery.trim()
        ? `/api/users/search?q=${encodeURIComponent(searchQuery.trim())}`
        : "/api/users/search"

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
      }
    } catch {
      console.error("Error searching users")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, searchUsers])

  const handleUserClick = (user: UserType) => {
    setSelectedId(user.id)
    onUserSelect?.(user)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar Usuario</CardTitle>
        <CardDescription>
          Busca por nombre, apellido, DNI o usuario
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <User className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                {query ? "No se encontraron usuarios" : "No hay usuarios registrados"}
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => handleUserClick(user)}
                    className={cn(
                      "w-full rounded-lg border p-4 text-left transition-colors hover:bg-muted/50",
                      selectedId === user.id && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {user.nombre} {user.apellido}
                          </span>
                          {user.files && user.files.length > 0 && (
                            <Badge variant="secondary">
                              {user.files.length} archivo{user.files.length !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>DNI: {user.dni}</span>
                          <span>Usuario: {user.username}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
