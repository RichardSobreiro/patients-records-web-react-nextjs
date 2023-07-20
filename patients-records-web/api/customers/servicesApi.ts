/** @format */

import { ApiResponse } from "@/models/Api/ApiResponse";
import { ErrorDetails } from "@/models/Api/ErrorDetails";
import { CreateServiceRequest } from "@/models/customers/services/CreateServiceRequest";
import { CreateServiceResponse } from "@/models/customers/services/CreateServiceResponde";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const createService = async (
  accessToken: string,
  customerId: string,
  request: CreateServiceRequest
): Promise<ApiResponse> => {
  const URL = `${publicRuntimeConfig.API_URL}/customers/${customerId}/services`;

  const formData = new FormData();
  formData.append("date", request.date.toDateString());
  formData.append("serviceTypes", JSON.stringify(request.serviceTypes));
  // for (const serviceType of request.serviceTypes) {
  //   formData.append("serviceTypes", {
  //     serviceTypeId: serviceType.serviceTypeId,
  //     serviceTypeDescription: serviceType.serviceTypeDescription,
  //     notes: serviceType.notes,
  //     isDefault: serviceType.isDefault,
  //   } as unknown as Blob);
  // }
  formData.append("beforeNotes", request.beforeNotes!);
  formData.append("afterNotes", request.afterNotes!);
  for (const photo of request.beforePhotos) {
    let localUri = photo.uri;
    let filename = localUri?.split("/").pop();
    let match = /\.(\w+)$/.exec(filename!);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append("beforePhotos", {
      name: filename,
      type: type,
      uri: localUri,
      width: photo.width,
      height: photo.height,
    } as unknown as Blob);
  }
  for (const photo of request.afterPhotos) {
    let localUri = photo.uri;
    let filename = localUri?.split("/").pop();
    let match = /\.(\w+)$/.exec(filename!);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append("afterPhotos", {
      name: filename,
      type: type,
      uri: localUri,
      width: photo.width,
      height: photo.height,
    } as unknown as Blob);
  }

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      body: formData,
    });

    if (response.ok) {
      const responseBody: CreateServiceResponse = await response.json();
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
