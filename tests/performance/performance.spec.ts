import { test, expect } from "@fixtures/app.fixture";
import { TestData } from "@utils/testData";

test.describe("[PERF] Performance Smoke Test - Create Booking", () => {
  test("verify createBooking performance with 50 requests", async ({
    bookingApi,
    authToken,
  }) => {
    const iterations = 50;
    const times: number[] = [];
    let errors = 0;

    console.log(
      `Running Create Booking Performance Smoke Test (${iterations} requests)...`,
    );

    for (let i = 0; i < iterations; i++) {
      const bookingPayload = TestData.generateValidBookingPayload();

      const start = Date.now();

      try {
        const result = await bookingApi.createBooking(
          bookingPayload,
          authToken,
        );

        const duration = result.responseTime || Date.now() - start;
        times.push(duration);

        expect(result.response.status()).toBe(200);
      } catch (e) {
        errors++;
        console.error(`Error in iteration ${i}:`, e);
      }
    }

    const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);
    const sortedTimes = [...times].sort((a, b) => a - b);
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];

    test.info().annotations.push({
      type: "Performance Results - Create Booking",
      description: `
        Iterations: ${iterations}
        Average Response Time: ${avg} ms
        P95 Response Time: ${p95} ms
        Min Time: ${Math.min(...times)} ms
        Max Time: ${Math.max(...times)} ms
        Error Rate: ${((errors / iterations) * 100).toFixed(2)}%
      `.trim(),
    });

    console.log(`\n Create Booking Performance Results:`);
    console.log(`   Average Response Time : ${avg} ms`);
    console.log(`   P95 Response Time     : ${p95} ms`);
    console.log(
      `   Error Rate            : ${((errors / iterations) * 100).toFixed(2)}%`,
    );

    expect(
      parseFloat(avg),
      "Average response time should be under 2 seconds",
    ).toBeLessThan(2000);

    expect(errors, "Should have very few errors").toBeLessThan(5);
  });
});
