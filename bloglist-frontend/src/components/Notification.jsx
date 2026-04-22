const Notification = ({ notification }) => {

    const { message, isError } = notification

    if (!message) {
        return null
    }

    const style = {
        color: isError ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: 15,
        borderStyle: 'solid',
        borderRadius: 2,
        padding: 10,
        marginBottom: 10,
    }

    return <div className="notification" style={style}>{message}</div>
}

export default Notification