const RoleNames = Object.freeze({
    Admin: 'Admin',
    SuperAdmin: 'SuperAdmin',
    Helper: 'Helper',
});

export const Roles = Object.freeze({
    ...RoleNames,
    AdminRoles: [RoleNames.Admin, RoleNames.SuperAdmin],
});
