/** @format */

import { ApiResponse } from "@/models/Api/ApiResponse";
import { ErrorDetails } from "@/models/Api/ErrorDetails";
import { CreateAnamnesisRequest } from "@/models/customers/CreateAnamnesisRequest";
import { CreateAnamnesisResponse } from "@/models/customers/CreateAnamnesisResponse";
import { GetAnamnesisByIdResponse } from "@/models/customers/GetAnamnesisByIdResponse";
import { GetAnamnesisResponse } from "@/models/customers/GetAnamnesisResponse";
import { UpdateAnamnesisRequest } from "@/models/customers/UpdateAnamnesisRequest";
import { UpdateAnamnesisResponse } from "@/models/customers/UpdateAnamnesisResponse";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const createAnamnesis = async (
  accessToken: string,
  request: CreateAnamnesisRequest
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers/${request.customerId}/anamnesis`;

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
      const responseBody: CreateAnamnesisResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
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

export const getAnamnesisById = async (
  accessToken: string,
  customerId: string,
  anamnesisId: string
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers/${customerId}/anamnesis/${anamnesisId}`;

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
      const responseBody: GetAnamnesisByIdResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
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

export const updateAnamnesis = async (
  accessToken: string,
  request: UpdateAnamnesisRequest
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers/${request.customerId}/anamnesis/${request.anamneseId}`;

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
      const responseBody: UpdateAnamnesisResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
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

export const getAnamnesis = async (
  accessToken: string,
  pageNumber: string,
  limit: string,
  customerId: string,
  startDate?: Date,
  endDate?: Date,
  anamnesisType?: string
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers/${customerId}/anamnesis?pageNumber=${pageNumber}&limit=${limit}&customerId=${customerId}`;

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
      const responseBody: GetAnamnesisResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
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
