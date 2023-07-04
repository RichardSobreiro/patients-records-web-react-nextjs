/** @format */

import { ApiResponse } from "@/models/Api/ApiResponse";
import { ErrorDetails } from "@/models/Api/ErrorDetails";
import { AditionalInfoRequest } from "@/models/users/AditionalInfoRequest";
import { AditionalInfoResponse } from "@/models/users/AditionalInfoResponse";

export const updateUserAditionalInfo = async (
  accessToken: string,
  request: AditionalInfoRequest
): Promise<ApiResponse> => {
  const URL = `http://localhost:3005/users/settings`;

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
      const aditionalInfoResponse: AditionalInfoResponse =
        await response.json();
      return new ApiResponse(true, response.status, aditionalInfoResponse);
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

export const getUserAditionalInfo = async (
  accessToken: string
): Promise<ApiResponse> => {
  const URL = `http://localhost:3005/users/settings`;

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
      const aditionalInfoResponse: AditionalInfoResponse =
        await response.json();
      return new ApiResponse(true, response.status, aditionalInfoResponse);
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
