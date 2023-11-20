import { getPurchaseStats, getPurchaseTotal } from "../purchase";
import { getFromStorage } from "../secureStorage";

jest.mock("../secureStorage", () => {
  return {
    getFromStorage: jest.fn(),
  };
});

const mockPurchases = [
  { type: "Supermarket", value: 100, dop: "2023-10-15" },
  { type: "Supermarket", value: 20.2, dop: "2023-10-03" },
  { type: "Fun", value: 50, dop: "2023-10-10" },
  { type: "Fun", value: 50, dop: "2023-08-22" },
  { type: "Travel", value: 300, dop: "2023-10-14" },
  { type: "Other", value: 25, dop: "2023-11-01" },
];

describe("Purchase Functions", () => {
  test("getPurchaseStats should return a breakdown of purchases by type for the specified month and year", async () => {
    getFromStorage.mockReturnValue(Promise.resolve(JSON.stringify(mockPurchases)));
    const stats = await getPurchaseStats("test@email.com", 9, 2023);
    expect(stats).toEqual({ Supermarket: 120.2, Fun: 50, Travel: 300 });
  });

  test("getPurchaseTotal should calculate the total amount spent for the specified month and year", async () => {
    getFromStorage.mockReturnValue(Promise.resolve(JSON.stringify(mockPurchases)));
    const total = await getPurchaseTotal("test@email.com", 9, 2023);
    expect(total).toEqual("470");
  });

  test("getPurchaseStats and getPurchaseTotal should handle empty purchases data", async () => {
    getFromStorage.mockReturnValue(Promise.resolve("[]"));
    const stats = await getPurchaseStats("test@email.com", 10, 2023);
    expect(stats).toEqual({});
    const total = await getPurchaseTotal("test@email.com", 10, 2023);
    expect(total).toEqual("0");
  });
});
