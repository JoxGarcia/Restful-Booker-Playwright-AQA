import { test, expect } from "@fixtures/app.fixture";
import { tenants } from "@data/tenant.data";
import { TestData } from "@utils/testData";

test.describe("[API][MULTI-TENANT] Multi-Tenant Isolation & Security", () => {
  const tenantKeys = ["tenantA", "tenantB", "tenantC"] as const;

  tenantKeys.forEach((tenantKey) => {
    test(`verify booking creation and isolation for ${tenantKey}`, async ({
      bookingApi,
      authToken,
    }) => {
      const tenant = tenants[tenantKey];

      const bookingPayload = TestData.generateValidBookingPayload({
        firstname: `${tenant.firstnamePrefix}User`,
        additionalneeds: tenant.additionalneeds,
      });

      // Create booking for this tenant
      const { response } = await bookingApi.createBooking(
        bookingPayload,
        authToken,
        tenant.id,
      );
      expect(response.status()).toBe(200);
      const created = await response.json();

      // Verify tenant-specific data is preserved
      expect(created.booking.firstname).toContain(tenant.firstnamePrefix);
      expect(created.booking.additionalneeds).toBe(tenant.additionalneeds);

      // Verify the tenant can retrieve its own booking
      const getResult = await bookingApi.getBooking(created.bookingid);

      expect(getResult.status()).toBe(200);
    });
  });

  test("verify cross-tenant isolation (Security Test)", async ({
    bookingApi,
    authToken,
  }) => {
    // Create booking for tenantA
    const tenantA = tenants.tenantA;
    const payloadA = TestData.generateValidBookingPayload({
      firstname: `${tenantA.firstnamePrefix}CrossTest`,
      additionalneeds: tenantA.additionalneeds,
    });

    const { response } = await bookingApi.createBooking(
      payloadA,
      authToken,
      tenantA.id,
    );
    const bookingA = await response.json();

    // Attempt to access tenantA's booking from tenantB
    const tenantB = tenants.tenantB;
    const crossAccessResult = await bookingApi.getBooking(
      bookingA.bookingid,
      authToken,
      tenantB.id,
    );

    const status = crossAccessResult.status();

    if (status === 200) {
      // Critical Security Issue
      test.info().annotations.push({
        type: "🔴 SECURITY RISK",
        description: `Cross-tenant data exposure detected! 
                    Tenant ${tenantB.id} was able to access booking 
                    from ${tenantA.id} (ID: ${bookingA.bookingid})`,
      });

      expect(status, "CRITICAL: Tenant B should NOT access Tenant A data").toBe(
        404,
      );
    } else {
      // Good behavior
      test.info().annotations.push({
        type: "✅ Security Validation",
        description: `Tenant ${tenantB.id} correctly cannot access booking from ${tenantA.id} (Status: ${status})`,
      });

      expect(status).toBe(404);
    }
  });
});
