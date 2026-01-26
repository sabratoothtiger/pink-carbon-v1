"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { createClient } from "@/lib/supabase/client"
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'

interface SearchResult {
  id: string
  type: 'workqueue_item' | 'other'
  title: string
  subtitle?: string
  status?: string
  returnYear?: number 
  href: string
}

interface SearchProps {
  accountId?: string | null
}

// TODO: Debounce input and clean up 
export default function Search({ accountId }: SearchProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const supabase = createClient()

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    setShowSearchResults(true)

    try {
      const results: SearchResult[] = []

      // Search Workqueue Items (simplified query to avoid join issues)
      const { data: workqueueItems, error } = await supabase
        .from("workqueue")
        .select(`
          id,
          identifier,
          status_id, 
          statuses ( name_internal ),
          received_at,
          position,
          external_queue_position,
          return_year,
          notes
        `)
        .or(`identifier.ilike.%${query}%, notes.ilike.%${query}%`)
        .limit(5)
        .eq(`account_id`, `${accountId}`)

      if (error) {
        console.error('Supabase search error:', error)
        setSearchResults([])
        return
      }

      if (workqueueItems) {

        workqueueItems.forEach((item: any) => {
          // Use account-specific workqueue route if in account context
          const itemHref = accountId 
            ? `/dashboard/account/${accountId}/workqueue?item=${item.id}`
            : `/workqueue/item/${item.id}`
            
          const statusName = item.statuses?.name_internal
            
          results.push({
            id: item.id,
            type: 'workqueue_item',
            title: `${item.identifier || `Item ${item.id}`}`,
            subtitle: `${statusName || 'Unknown Status'} • Position: ${item.position || 'N/A'}`,
            status: statusName || `Unknown Status`,
            returnYear: item.return_year,
            href: itemHref
          })
        })
      }

      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(result.href)
    setSearchTerm("")
    setSearchResults([])
    setShowSearchResults(false)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'workqueue_item':
        return 'pi pi-file'
      default:
        return 'pi pi-search'
    }
  }

  return (
    <div className="relative">
      <IconField iconPosition="left" className="p-input-icon-left">
        <InputIcon className={searchLoading ? "pi pi-spin pi-spinner" : "pi pi-search"} />
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowSearchResults(true)}
          placeholder="Search..."
          className="w-80 hidden md:block"
        />
      </IconField>
      {/* Search Results Dropdown */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="absolute top-full right-0 w-96 mt-2 bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className="p-4 hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0 flex items-start gap-4 transition-colors duration-150"
            >
              <div className="mt-1">
                <i className={`${getResultIcon(result.type)} text-pink-500 text-lg`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-primary text-base leading-snug">{result.title}</div>
                {result.subtitle && (
                  <div className="text-sm text-text-secondary mt-1 leading-relaxed">{result.subtitle}</div>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {result.returnYear && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full font-medium text-center">
                    {result.returnYear}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showSearchResults && searchTerm && searchResults.length === 0 && !searchLoading && (
        <div className="absolute top-full right-0 w-96 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 p-6 text-center">
          <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            No results found for "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  )
}