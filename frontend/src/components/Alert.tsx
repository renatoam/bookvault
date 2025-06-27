import { CheckCircle, CircleX, Info, TriangleAlert } from "lucide-react"

export interface NotifyProps {
  status: 'success' | 'warning' | 'error' | 'info',
  message: string
}

export default function Alert(props: Readonly<NotifyProps>) {
  const statusStyle = {
    success: {
      icon: <CheckCircle />,
      class: "alert-success"
    },
    warning: {
      icon: <TriangleAlert />,
      class: "alert-warning"
    },
    error: {
      icon: <CircleX />,
      class: "alert-error"
    },
    info: {
      icon: <Info />,
      class: "alert-info"
    },
  }

  return (
    <div role="alert" className={`alert ${statusStyle[props.status].class}`}>
      {statusStyle[props.status].icon}
      <span>{props.message}</span>
    </div>
  )
}
