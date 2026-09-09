export default function Modal({ title, children, actions }) {
  return (
    <div className="overlay">
      <div className="modal" role="dialog" aria-modal="true">
        {title && <h3 className="modal-title">{title}</h3>}
        <div className="modal-body">{children}</div>
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  )
}
