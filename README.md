# Freshly Fruit - A Point of Sales Web Application selling Fruits

## Table of Contents

1. [App Description](#App-Description)
2. [User Stories Implemented](#User-Stories-Implemented)
3. [Technologies](#Technologies)
1. [Deployment](#Deployment)


## App Description

This is a Point of Sales (POS) application developed for the RAiD Software Engineering Challenge assessment. The application allows users to make purchase orders of fruits and track order history and fulfillment status. It also is designed to have a pre-setup admin account (upon deployment) to manage the store by adding/deleting fruits in catalog, amending quantities, updating and tracking fulfillment of orders.

## User Stories Implemented

Story 1. As a customer, I want to see a list of fruits that are available to buy (complete with stock and pricing information), so that I can decide which fruits I want to buy.

Story 2. As a customer, I want to keep track of the fruits and quantity that I have shortlisted (including the total amount I need to pay), so that I can adjust my purchasing decisions as I shop.

Story 3. As a customer, I want to submit my order of the fruits I selected, so that I can complete my purchase when I am done shopping. Assume that payment is done separate from this POS application.

Story 4. As an owner, I want to see the orders that my customers have submitted, so that I can fulfill their orders.

Story 6. As an owner, I want to be able to add new fruits and amend my stock levels, so that I can keep my online store up to date.

Story 7. As a customer, I want to be able to log in and see my order history, so that I can track my previous purchases.

Story 11. As a customer, I want to be able to use the app on my phone so I can shop on the go.

Story 15. As an owner, I do not want my customers to be able to see the whole store's order history, or amend my stocks, or perform any actions that should only be available for me.

Story 17. As a customer, I want the fruit store pages to load quickly at all times, so that I can browse and shop without delays.

## Technologies

Frontend: ReactJS
Backend: Express, Node.js with Sequelize as ORM
Database: MySQL workbench, ClearDB for deployment

## Deployment

The application backend is hosted on Heroku, database on ClearDB and frontend on Netlify. The application can be accessed via this link: (https://freshly-fruit.netlify.app/). The admin account which manages the store is set to be (username: admin), (password: admin123)