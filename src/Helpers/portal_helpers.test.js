import { checkPermission } from "./portal_helpers";


it('return true if permission is allowed', () => {
    expect.assertions(1)
    expect(checkPermission('login', ['login'])).toEqual(true)
})