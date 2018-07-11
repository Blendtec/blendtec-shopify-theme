var events = {
    kill: event => {
        event.preventDefault();
        event.stopPropagation();
    }
};

export default events;
