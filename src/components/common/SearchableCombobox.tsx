import { useEffect, useRef, useState } from 'react'

type ComboboxItem = {
  id: number
  name: string
}

type Props<T extends ComboboxItem> = {
  items: T[]
  value: number
  onChange: (id: number) => void
  placeholder?: string
}

export function SearchableCombobox<T extends ComboboxItem>({ items, value, onChange, placeholder }: Props<T>) {
  const selectedItem = items.find((item) => item.id === value)
  const [query, setQuery] = useState(selectedItem?.name ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setQuery(selectedItem?.name ?? '')
    }
  }, [selectedItem, isOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredItems = items.filter((item) => item.name.includes(query.trim()))

  function selectItem(item: T) {
    onChange(item.id)
    setQuery(item.name)
    setIsOpen(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((i) => Math.min(i + 1, filteredItems.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = filteredItems[highlightedIndex]
      if (item) selectItem(item)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
      setQuery(selectedItem?.name ?? '')
    }
  }

  return (
    <div className="searchable-combobox" ref={containerRef}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onFocus={() => {
          setIsOpen(true)
          setHighlightedIndex(0)
        }}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
          setHighlightedIndex(0)
        }}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <ul className="searchable-combobox-list">
          {filteredItems.length === 0 ? (
            <li className="searchable-combobox-empty">該当する項目がありません</li>
          ) : (
            filteredItems.map((item, index) => (
              <li
                key={item.id}
                className={index === highlightedIndex ? 'active' : ''}
                onMouseDown={(e) => {
                  e.preventDefault()
                  selectItem(item)
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {item.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
