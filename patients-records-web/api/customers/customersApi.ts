/** @format */

import { ApiResponse } from "@/models/Api/ApiResponse";
import { ErrorDetails } from "@/models/Api/ErrorDetails";
import { CreateCustomerRequest } from "@/models/customers/CreateCustomerRequest";
import { CreateCustomerResponse } from "@/models/customers/CreateCustomerResponse";
import { GetCustomersResponse } from "@/models/customers/GetCustomersResponse";
import { UpdateCustomerRequest } from "@/models/customers/UpdateCustomerRequest";
import { UpdateCustomerResponse } from "@/models/customers/UpdateCustomerResponse";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const createCustomer = async (
  accessToken: string,
  request: CreateCustomerRequest
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const createCustomerResponse: CreateCustomerResponse =
        await response.json();
      return new ApiResponse(true, response.status, createCustomerResponse);
    } else {
      return new ApiResponse(
        false,
        response.status,
        ``,
        new ErrorDetails(``, response.status)
      );
    }
  } catch (error: any) {
    return new ApiResponse(
      false,
      400,
      error.message,
      new ErrorDetails(error.message, 400)
    );
  }
};

export const updateCustomer = async (
  accessToken: string,
  request: UpdateCustomerRequest
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers/${request.customerId}`;

  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const createCustomerResponse: UpdateCustomerResponse =
        await response.json();
      return new ApiResponse(true, response.status, createCustomerResponse);
    } else {
      return new ApiResponse(
        false,
        response.status,
        ``,
        new ErrorDetails(``, response.status)
      );
    }
  } catch (error: any) {
    return new ApiResponse(
      false,
      400,
      error.message,
      new ErrorDetails(error.message, 400)
    );
  }
};

export const getCustomers = async (
  accessToken: string,
  pageNumber: string,
  limit: string,
  customerName?: string,
  lastServiceStartDate?: string,
  lastServiceEndDate?: string,
  proceedingTypeId?: string
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers?pageNumber=${pageNumber}&limit=${limit}`;

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const getCustomerResponse: GetCustomersResponse = await response.json();
      return new ApiResponse(true, response.status, getCustomerResponse);
    } else {
      return new ApiResponse(
        false,
        response.status,
        response.statusText,
        new ErrorDetails(response.statusText, response.status)
      );
    }
  } catch (error: any) {
    return new ApiResponse(
      false,
      400,
      error.message,
      new ErrorDetails(error.message, 400)
    );
  }
};

export const getCustomerById = async (
  accessToken: string,
  customerId: string
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers/${customerId}`;

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const getCustomerResponse: GetCustomersResponse = await response.json();
      return new ApiResponse(true, response.status, getCustomerResponse);
    } else {
      const error = await response.json();
      return new ApiResponse(
        false,
        response.status,
        error.message,
        new ErrorDetails(error.message, response.status)
      );
    }
  } catch (error: any) {
    return new ApiResponse(
      false,
      400,
      error.message,
      new ErrorDetails(error.message, 400)
    );
  }
};
