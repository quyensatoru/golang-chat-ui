self.onmessage = (event) => {
    const { type, data, currentData, env } = event.data;
    const host = env.API_URL;
    if(type === 'merge-message') {
        //merge message hiện có với message mới nhận được
        fetch(`${host}/message/channel?channel_id=` + data.channelID + '&limit=' + data.limit + '&offset=' + data.offset, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            const newMessages = [...currentData, ...data.data];
            self.postMessage({ type: 'merged-messages', data: newMessages });
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
            self.postMessage({ type: 'merged-messages-failed', error: error });
        });
    }
}