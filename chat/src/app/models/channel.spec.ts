import { Channel } from './channel';

describe('Channel', () => {
  it('should create an instance', () => {
    expect(new Channel("cid1", "Channel one", "gid")).toBeTruthy();
  });
});
