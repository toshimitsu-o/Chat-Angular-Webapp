import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User("test", "test@test.com", "user", "pass", "file.png")).toBeTruthy();
  });
});
