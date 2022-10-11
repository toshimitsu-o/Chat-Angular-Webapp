import { Message } from './message';

describe('Message', () => {
  it('should create an instance', () => {
    expect(new Message("text", "message body", "userid", "c1")).toBeTruthy();
  });
});
