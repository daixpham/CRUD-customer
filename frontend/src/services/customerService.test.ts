import { describe, it, expect, beforeEach, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import api, { customerService, parseApiError } from "./customerService";
import type { Customer, ValidationErrorResponse } from "../types/Customer";
import { AxiosError } from "axios";

const mock = new MockAdapter(api);

const mockAddress = {
  street: "Main Street",
  houseNumber: "1",
  city: "Hamburg",
  postalCode: "20095",
  country: "Germany",
};

const mockCustomer: Customer = {
  id: "test-id-123",
  firstName: "John",
  lastName: "Doe",
  freeTextInformation: "Some info",
  vatNumber: "DE123456789",
  address: mockAddress,
};

// ---------------------------------------------------------------------------
// parseApiError
// ---------------------------------------------------------------------------
describe("parseApiError()", () => {
  it("should return field errors on HTTP 400 with validation errors", () => {
    const err = {
      response: {
        status: 400,
        data: {
          message: "Validation failed",
          errors: {firstName: "First name must not be blank"},
        } satisfies ValidationErrorResponse,
      },
    } as unknown as AxiosError<ValidationErrorResponse>;

    const result = parseApiError(err);

    expect(result).toEqual({ firstName: "First name must not be blank" });
  });

  it("should return general error when status is not 400", () => {
    const err = {
      response: {
        status: 500,
        data: { message: "Internal server error", errors: {} },
      },
    } as AxiosError<ValidationErrorResponse>;

    const result = parseApiError(err);

    expect(result).toEqual({ general: "Internal server error" });
  });

  it("should return fallback message when no response message is available", () => {
    const err = {} as AxiosError<ValidationErrorResponse>;

    const result = parseApiError(err);

    expect(result).toEqual({ general: "An unexpected error occurred" });
  });

  it("should return general error on 400 without errors field", () => {
    const err = {
      response: {
        status: 400,
        data: { message: "Bad request", errors: undefined },
      },
    } as unknown as AxiosError<ValidationErrorResponse>;

    const result = parseApiError(err);

    expect(result).toEqual({ general: "Bad request" });
  });
});

// ---------------------------------------------------------------------------
// customerService
// ---------------------------------------------------------------------------
describe("customerService", () => {
  beforeEach(() => mock.reset());
  afterEach(() => mock.reset());

  // -------------------------------------------------------------------------
  describe("getAll()", () => {
    it("should fetch all customers", async () => {
      mock.onGet("/customer").reply(200, [mockCustomer]);

      const res = await customerService.getAll();

      expect(res.data).toHaveLength(1);
      expect(res.data[0]).toEqual(mockCustomer);
    });

    it("should return an empty array when no customers exist", async () => {
      mock.onGet("/customer").reply(200, []);

      const res = await customerService.getAll();

      expect(res.data).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  describe("create()", () => {
    it("should POST and return the created customer", async () => {
      const payload: Omit<Customer, "id"> = {
        firstName: "John",
        lastName: "Doe",
        address: mockAddress,
      };
      mock.onPost("/customer").reply(201, { message: "Customer created successfully", customer: mockCustomer });

      const res = await customerService.create(payload);

      expect(res.data.customer).toEqual(mockCustomer);
      expect(res.data.message).toBe("Customer created successfully");
    });

    it("should throw on 400 validation error", async () => {
      mock.onPost("/customer").reply(400, {
        message: "Validation failed",
        errors: { firstName: "First name must not be blank" },
      });

      await expect(customerService.create({ firstName: "", lastName: "Doe", address: mockAddress }))
        .rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  describe("getById()", () => {
    it("should fetch a customer by id", async () => {
      mock.onGet("/customer/test-id-123").reply(200, mockCustomer);

      const res = await customerService.getById("test-id-123");

      expect(res.data).toEqual(mockCustomer);
    });

    it("should throw on 404 when customer is not found", async () => {
      mock.onGet("/customer/unknown-id").reply(404, { message: "Customer not found" });

      await expect(customerService.getById("unknown-id")).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  describe("update()", () => {
    it("should PATCH and return the updated customer", async () => {
      const updated = { ...mockCustomer, firstName: "Jane" };
      mock.onPatch("/customer/test-id-123").reply(200, {
        message: "Customer updated successfully",
        customer: updated,
      });

      const res = await customerService.update("test-id-123", { firstName: "Jane" });

      expect(res.data.customer.firstName).toBe("Jane");
      expect(res.data.message).toBe("Customer updated successfully");
    });

    it("should throw on 404 when customer is not found", async () => {
      mock.onPatch("/customer/unknown-id").reply(404, { message: "Customer not found" });

      await expect(customerService.update("unknown-id", { firstName: "Jane" })).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  describe("delete()", () => {
    it("should DELETE a customer successfully", async () => {
      mock.onDelete("/customer/test-id-123").reply(200, { message: "Customer deleted successfully" });

      const res = await customerService.delete("test-id-123");

      expect(res.status).toBe(200);
    });

    it("should throw on 404 when customer is not found", async () => {
      mock.onDelete("/customer/unknown-id").reply(404, { message: "Customer not found" });

      await expect(customerService.delete("unknown-id")).rejects.toThrow();
    });
  });
});

