import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | AVANI360` : 'AVANI360 | Tamil Nadu Land & Property Marketplace'
  }, [title])
}
