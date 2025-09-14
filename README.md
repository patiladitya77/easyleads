# Buyer Management System (Real Estate CRM Lite)

This project is a **real estate lead management system** built using **Next.js, Prisma, NeonDB,Firebase and Zod**. It helps real estate agencies or property consultants manage people who are looking to buy or rent properties.

## Key Features

- **Buyer Records Management** – Add, view, update, and delete buyer details (name, phone, city, property type, budget, etc.).
- **Search & Filters** – Find buyers by city, property type, status, or timeline.
- **Validation with Zod** – Ensures all form inputs are clean and valid before saving.
- **Database with Prisma + NeonDB** – Strongly typed schema and easy migrations with PostgreSQL on NeonDB.
- **Buyer History Tracking** – Records every change made to a buyer for accountability.
- **API Routes in Next.js** – REST-style API endpoints for CRUD operations (create, read, update, delete).
- **Frontend with Next.js (App Router)** – Minimal UI focusing on functionality (list of buyers, add new buyer form, delete/update support).

## Tech Stack

- **Frontend:** Next.js (App Router, React)
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** NeonDB (PostgreSQL)
- **Validation:** Zod
- **Deployment:** Vercel (Frontend + API), NeonDB (Database)

## Use Case

- Employees (agents) can add details of people who want to buy or rent a property.
- Managers can see all buyers in one place, update their status (New, Contacted, Negotiation, Converted, etc.), and track interactions.
- Helps teams avoid losing leads and improves sales workflow.

# how to run this loaclly?

    - clone this repository
    - run the command => npm install
    - setup your environmental variables
    - you can refer .env.example file for environment variables
