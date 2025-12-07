// Permission matrix for roles
const permissions = {
  administrateur: {
    users: ['create', 'read', 'update', 'delete'],
    references: ['create', 'read', 'update', 'delete'],
    components: ['create', 'read', 'update', 'delete'],
    stock: ['create', 'read', 'update', 'delete', 'inventory']
  },
  gestionnaire: {
    users: [],
    references: ['create', 'read', 'update', 'delete'],
    components: ['create', 'read', 'update', 'delete'],
    stock: ['create', 'read', 'update', 'delete', 'inventory']
  },
  magasinier: {
    users: [],
    references: ['read'],
    components: ['read'],
    stock: ['read', 'update', 'inventory']
  },
  consultant: {
    users: [],
    references: ['read'],
    components: ['read'],
    stock: ['read']
  }
};

const hasPermission = (role, resource, action) => {
  return permissions[role] &&
         permissions[role][resource] &&
         permissions[role][resource].includes(action);
};

module.exports = { permissions, hasPermission };
