/*
  Portal helper functions
*/
export const checkPermission = (userPermissions, allowedPermissions) => {
    return userPermissions.includes(allowedPermissions);
}