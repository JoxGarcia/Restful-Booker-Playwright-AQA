export const tenants = {
  tenantA: {
    id: "tenantA",
    name: "Tenant A",
    firstnamePrefix: "tenantA_",
    additionalneeds: "tenantA_e2e_isolation_test",
  },
  tenantB: {
    id: "tenantB",
    name: "Tenant B",
    firstnamePrefix: "tenantB_",
    additionalneeds: "tenantB_e2e_isolation_test",
  },
  tenantC: {
    id: "tenantC",
    name: "Tenant C",
    firstnamePrefix: "tenantC_",
    additionalneeds: "tenantC_e2e_isolation_test",
  },
} as const;

export type TenantKey = keyof typeof tenants;
