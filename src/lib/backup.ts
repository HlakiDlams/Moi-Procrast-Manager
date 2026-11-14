import { db } from './db'

const FORMAT = 'hlakis-planner-backup'

/** Dump every table to a JSON object. The API key is left out unless asked for. */
export async function exportData(includeApiKey = false) {
  const tables: Record<string, unknown[]> = {}
  for (const t of db.tables) {
    let rows = await t.toArray()
    if (t.name === 'settings' && !includeApiKey) {
      rows = rows.filter((r: { key: string }) => r.key !== 'mistralApiKey')
    }
    tables[t.name] = rows
  }
  return { format: FORMAT, version: db.verno, exportedAt: new Date().toISOString(), tables }
}

export async function downloadBackup(includeApiKey = false) {
  const data = await exportData(includeApiKey)
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `unprocrastinator-${data.exportedAt.slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Replace all data with a backup. Unknown tables in the file are ignored. */
export async function importData(json: unknown) {
  const data = json as { format?: string; tables?: Record<string, unknown[]> }
  if (data?.format !== FORMAT || typeof data.tables !== 'object') {
    throw new Error("That file isn't an Un-procrast-inator backup.")
  }
  await db.transaction('rw', db.tables, async () => {
    for (const t of db.tables) {
      const rows = data.tables![t.name]
      if (!Array.isArray(rows)) continue
      // keep the device's API key if the backup didn't include one
      const keepKey = t.name === 'settings' ? await t.get('mistralApiKey') : undefined
      await t.clear()
      await t.bulkAdd(rows)
      if (keepKey && !rows.some((r) => (r as { key?: string }).key === 'mistralApiKey')) {
        await t.put(keepKey)
      }
    }
  })
}
