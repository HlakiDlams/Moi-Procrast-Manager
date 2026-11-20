const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Simple 7-day XP bar chart (SVG-free, just flex bars). */
export default function WeekChart({ data }: { data: { day: string; xp: number }[] }) {
  const max = Math.max(10, ...data.map((d) => d.xp))
  return (
    <div className="weekchart" role="img" aria-label="XP earned over the last 7 days">
      {data.map((d, i) => {
        const label = DAY[new Date(d.day + 'T12:00:00').getDay()]
        const isToday = i === data.length - 1
        return (
          <div className="wc-col" key={d.day}>
            <span className="wc-val">{d.xp || ''}</span>
            <div className="wc-track">
              <div
                className={'wc-bar' + (isToday ? ' today' : '')}
                style={{ height: `${(d.xp / max) * 100}%` }}
              />
            </div>
            <span className={'wc-label' + (isToday ? ' today' : '')}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}
