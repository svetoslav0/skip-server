import express from "express";

export interface IRoutable {
    registerRoutes(): express.Router;
}
