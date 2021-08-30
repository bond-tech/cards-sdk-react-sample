import './Dialog.css'

const Dialog = ({children, onClose}) => {
    return (
        <div className={'dialog'}>
            <div className="dialog__mask" onClick={onClose} />
            <div className="dialog__content">
                <div className="dialog__close-btn"  onClick={onClose}>x</div>
                {children}
            </div>
        </div>
    )
}

export default Dialog;