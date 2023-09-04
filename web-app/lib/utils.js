export function formatBytes (bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function formatList (list) {
  const daysSet = new Set()
  list.forEach(el => {
    daysSet.add(el.Key.replace(/videos\//, '').split('@')[0])
  })
  return Array.from(daysSet).map(day => {
    const hoursInDay = list.filter(l => l.Key.includes(day))
    const hoursSet = new Set()
    hoursInDay.forEach(h => hoursSet.add(h.Key.split('@')[1].replace(/\..*/g, '')))
    const hours = Array.from(hoursSet).map(hour => {
      const chunksSet = new Set()
      const chunksInHour = hoursInDay.filter(h => h.Key.includes(`@${hour}`))
      chunksInHour.forEach(ch => chunksSet.add(ch.Key.split('@')[1].replace(/\.mp4/, '')))
      const chunks = Array.from(chunksSet).map(ch => ({ chunk: ch, meta: list.find(l => l.Key.includes(`${day}@${ch}`)) }))
      return {
        hour,
        chunks
      }
    })
    return {
      day,
      hours
    }
  })
}
