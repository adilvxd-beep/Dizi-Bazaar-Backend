import { registerUser, loginUser, userSignupService, verifyOtpAndSignupService } from "./auth.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import ApiError from "../../shared/utils/ApiError.js";

export const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await registerUser(userData);
    res.json(new ApiResponse(200, newUser));
  } catch (error) {
    next(new ApiError(500, error.message));
  }
};

export const login = async (req, res, next) => {
  try {
    const userData = req.body;
    const loginResult = await loginUser(userData);
    res.json(new ApiResponse(200, loginResult));
  } catch (error) {
    next(new ApiError(500, error.message));
  }
};

//user signup controller
export const userSignupController = async (req, res, next) => {
  try {
    const result = await userSignupService(req.body);

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "User signup initiated successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

//moc otp request
export const requestOtpController = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return next(new ApiError(400, "MISSING_REQUIRED_FIELDS"));
    }

    // MOCK OTP (later replace with SMS)
    const otp = "1111";

    console.log(` OTP for ${phone} is ${otp}`);

    return res.status(200).json(
      new ApiResponse(
        200,
        { phone },
        "OTP sent successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

//verify otp and signup controller
export const verifyOtpController = async (req, res, next) => {
  try {
    const result = await verifyOtpAndSignupService(req.body);

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "OTP verified & user created successfully"
      )
    );
  } catch (error) {

    if (error.message === "INVALID_OTP") {
      return next(new ApiError(400, "Invalid OTP"));
    }

    if (error.message === "OTP_REQUIRED") {
      return next(new ApiError(400, "OTP is required"));
    }

    next(error);
  }
};


