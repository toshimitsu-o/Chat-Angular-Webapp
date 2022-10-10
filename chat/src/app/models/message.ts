export class Message {
    type: string;
    body: string;
    sender: string;
    to: string;

    constructor(type: string, body: string, sender: string, to: string) {
        this.type = type;
        this.body = body;
        this.sender = sender;
        this.to = to;
    }
}
