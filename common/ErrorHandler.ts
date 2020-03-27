import express from "express";

export const handleError = (err: any, res: express.Response) => {
    console.log("=".repeat(45));
    console.error(err);
    console.log("=".repeat(45));

    const statusCode: number = 500;
    const message: string = "Something went wrong...";

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
};
