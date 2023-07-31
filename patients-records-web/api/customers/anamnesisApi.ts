/** @format */

import { FileCustom } from "@/hooks/use-file-input";
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
  request: CreateAnamnesisRequest,
  files?: FileCustom[] | undefined
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers/${request.customerId}/anamnesis`;

  const formData = new FormData();
  formData.append("customerId", request.customerId);
  formData.append("date", request.date.toLocaleString());
  formData.append(
    "anamnesisTypesContent",
    JSON.stringify(request.anamnesisTypesContent)
  );
  if (files) {
    for (const file of files) {
      formData.append("files", file.file);
    }
  }

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      body: formData,
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
  request: UpdateAnamnesisRequest,
  files?: FileCustom[] | undefined
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers/${request.customerId}/anamnesis/${request.anamneseId}`;

  const formData = new FormData();
  formData.append("anamneseId", request.anamneseId);
  formData.append("customerId", request.customerId);
  formData.append("date", request.date.toLocaleString());
  formData.append(
    "anamnesisTypesContent",
    JSON.stringify(request.anamnesisTypesContent)
  );
  if (files) {
    for (const file of files) {
      formData.append("files", file.file);
    }
  }

  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      body: formData,
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
  anamnesisTypeIds?: string[]
): Promise<ApiResponse> => {
  let URL = `${publicRuntimeConfig.API_URL}/customers/${customerId}/anamnesis?pageNumber=${pageNumber}&limit=${limit}&customerId=${customerId}`;

  if (startDate && endDate) {
    URL += `&startDate=${startDate.toLocaleString()}&endDate=${endDate.toLocaleString()}`;
  }

  if (anamnesisTypeIds && anamnesisTypeIds.length > 0) {
    for (const anamnesisTypeId of anamnesisTypeIds)
      URL += `&anamnesisTypeIds=${anamnesisTypeId}`;
  }

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
