// src/store/modalStore.ts
import { create } from "zustand"

type ModalType = "product" | "category"

interface ModalState {
  isOpen: boolean
  type: ModalType | null
  data: unknown
  openModal: (type: ModalType, data?: unknown) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data = null) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}))
