import {
  Compass,
  ImageIcon,
} from 'lucide-react'


export const mobileNavItems = [
  {
    label: 'Home',
    path: '/',
    icon: Compass,
  },

  {
    label: 'Gallery',
    path: '/gallery',
    icon: ImageIcon,
  },
]

export const routeTitles = Object.fromEntries(
  mobileNavItems.map((item) => [item.path, item.label]),
)