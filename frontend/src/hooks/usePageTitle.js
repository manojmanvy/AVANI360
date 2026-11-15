import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | BookMyLand` : 'BookMyLand | Tamil Nadu Land & Property Marketplace'
  }, [title])
}
