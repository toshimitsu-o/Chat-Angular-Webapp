describe('Protractor Testing', function () {

    it('to check the page title', function () {
        browser.get('http://localhost:4200');
        browser.driver.getTitle().then(function (pageTitle) {
            expect(pageTitle).toEqual('Chatty');
        });
    });

    it('should navigate to Admin Users', function () {
        browser.get('http://localhost:4200');
        element(by.name('username')).sendKeys('sadmin');
        element(by.name('password')).sendKeys('pass');
        element(by.css('.btn')).click();

        browser.wait(waitForUrlChange("http://localhost:4200/chat"), 8000, () => {
            element(by.id('adminBtn')).click();
        element(by.id('ngb-nav-1')).click();
        element(by.id('usernameTh')).getText().then(function (th) {
            expect(th).toEqual('Username');
        });
        });
        
    });

    it('should navigate to Chat', function () {
        browser.get('http://localhost:4200/chat');
        
            element(by.css('.nav-flush')).all(by.css('.nav-item')).first().element(by.css('nav-link')).click();
        element(by.id('groupTitle')).getText().then(function (heading) {
            expect(heading).isNotEmpty();
        });
    });

    function waitForUrlChange(url) {
        return function () {
            return browser.getCurrentUrl().then(function (currentUrl) {
                console.log(currentUrl);
                return url === currentUrl;
            });
        }
    }
});