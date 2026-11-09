import { useEffect, useState } from 'react'
import { tabById, type TabId } from '../tabs'

function read(): TabId {
  const id = window.location.hash.replace(/^#\/?/, '').split('/')[0]
  return tabById(id)?.id ?? 'today'
}

/** Tiny hash router: #/study, #/planner ... so the phone back button works. */
export function useHashTab(): [TabId, (t: TabId) => void] {
  const [tab, setTab] = useState<TabId>(read)
  useEffect(() => {
    const on = () => setTab(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return [tab, (t) => (window.location.hash = `/${t}`)]
}
