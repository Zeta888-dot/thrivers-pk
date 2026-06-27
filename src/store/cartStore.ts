import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  color?: string
  size?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.id === item.id && i.color === item.color && i.size === item.size)
    if (existing) {
      return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) }
    }
    return { items: [...state.items, item] }
  }),
  
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  
  updateQuantity: (id, quantity) => set((state) => ({ items: state.items.map(i => i.id === id ? { ...i, quantity } : i) })),
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}))