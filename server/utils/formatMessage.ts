const formatMessage = (playerName: string, text: string) => {
    return {
        playerName,
        text,
        createdAt: new Date().getTime()
    }
}

export default formatMessage;