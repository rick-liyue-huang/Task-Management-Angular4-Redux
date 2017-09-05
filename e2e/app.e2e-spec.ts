import { TaskManagementAngular4Page } from './app.po';

describe('task-management-angular4 App', () => {
  let page: TaskManagementAngular4Page;

  beforeEach(() => {
    page = new TaskManagementAngular4Page();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
