/** @format */

import { ApiResponse } from "@/models/Api/ApiResponse";
import { ErrorDetails } from "@/models/Api/ErrorDetails";
import { LoginRequest } from "@/models/login/login-request";
import { CreateUserRequest } from "@/models/users/CreateUserRequest";

export const createAccount = async (
  request: CreateUserRequest
): Promise<ApiResponse> => {
  try {
    var formBody = [];
    formBody.push(
      encodeURIComponent("email") + "=" + encodeURIComponent(request.email)
    );
    formBody.push(
      encodeURIComponent("username") +
        "=" +
        encodeURIComponent(request.username)
    );
    request.password &&
      formBody.push(
        encodeURIComponent("password") +
          "=" +
          encodeURIComponent(request.password)
      );
    request.userCompanyName &&
      formBody.push(
        encodeURIComponent("userCompanyName") +
          "=" +
          encodeURIComponent(request.userCompanyName)
      );
    request.userPlanId &&
      formBody.push(
        encodeURIComponent("userPlanId") +
          "=" +
          encodeURIComponent(request.userPlanId)
      );
    const formBodyString = formBody.join("&");

    const response = await fetch("http://localhost:3005/users", {
      method: "post",
      body: formBodyString,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const createUserResponse = await response.json();
      return {
        ok: true,
        httpStatusCode: response.status,
        body: createUserResponse,
      };
    } else {
      const apiError = await response.json();
      return {
        ok: false,
        httpStatusCode: response.status,
        error: new ErrorDetails(
          apiError.message || response.statusText,
          apiError.status,
          "Error while creating user"
        ),
      };
    }
  } catch (error: any) {
    console.log("An unexpected error occurred while creating user: ", error);
    return {
      ok: false,
      httpStatusCode: 500,
      error: new ErrorDetails(
        error.message,
        "Unknown",
        "An unexpected error occurred while creating user"
      ),
    };
  }
};

export const login = async (request: LoginRequest): Promise<ApiResponse> => {
  try {
    const response = await fetch("http://localhost:3005/token", {
      method: "post",
      body: JSON.stringify({
        request,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const createUserResponse = await response.json();
      return {
        ok: true,
        httpStatusCode: response.status,
        body: createUserResponse,
      };
    } else {
      const apiError = await response.json();
      return {
        ok: false,
        httpStatusCode: response.status,
        error: new ErrorDetails(
          apiError.message || response.statusText,
          apiError.status,
          "Error while creating user"
        ),
      };
    }
  } catch (error: any) {
    console.log("An unexpected error occurred while creating user: ", error);
    return {
      ok: false,
      httpStatusCode: 500,
      error: new ErrorDetails(
        error.message,
        "Unknown",
        "An unexpected error occurred while creating user"
      ),
    };
  }
};
