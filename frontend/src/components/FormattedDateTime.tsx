interface FormattedDateTimeProps {
  dateTime: string
}

const FormattedDateTime = ({ dateTime }: FormattedDateTimeProps) => {
  const now = new Date()
  const date = new Date(dateTime)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  let relativeTime: string
  if (diffMins < 1) {
    relativeTime = "just now"
  } else if (diffMins < 60) {
    relativeTime = `${diffMins}m ago`
  } else if (diffHours < 24) {
    relativeTime = `${diffHours}h ago`
  } else {
    relativeTime = new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date)
  }

  const fullDateTime = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date)

  return (
    <time
      dateTime={dateTime}
      title={fullDateTime}
      className="text-xs text-gray-500 font-mono"
    >
      {relativeTime}
    </time>
  )
}

export default FormattedDateTime
