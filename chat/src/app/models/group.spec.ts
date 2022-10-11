import { Group } from './group';

describe('Group', () => {
  it('should create an instance', () => {
    expect(new Group("test", "test", "file")).toBeTruthy();
  });
});
