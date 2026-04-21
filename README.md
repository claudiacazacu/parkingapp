# Parking Aggregator App

This project is a web application for finding and comparing parking spaces in Bucharest. It is implemented as an MVP (Minimum Viable Product) based on the initial project idea.

---

## Overview

The application allows users to:

* search for parking locations
* filter and sort results
* view availability and predictions
* compare multiple parking options
* save favorite locations

---

## Technologies Used

* React with TypeScript
* TailwindCSS
* React Router
* LocalStorage

---

## Functionalities

### 1. Parking Data

Parking data is defined in `parkingData.ts`.

Each parking location contains:

* name, type and address
* total and available spots
* price per hour
* distance from user
* traffic level
* estimated arrival time (ETA)
* rating
* coordinates (latitude and longitude)

---

### 2. Filtering and Search

Implemented in `Filters.tsx`.

Users can:

* search by name, area or address
* filter by type (Mall, Office, Hypermarket)
* filter by availability status
* set a maximum distance
* sort results by:

  * recommendation
  * distance
  * availability
  * predicted availability
  * price

---

### 3. Recommendation System

Implemented in `parkingUtils.ts`.

Each parking receives a score based on:

* number of free spots
* distance
* ETA
* traffic level
* price
* rating

The parking with the highest score is shown as the main recommendation.

---

### 4. Real-Time Simulation

Implemented in `useParking.ts`.

* Parking availability updates every few seconds
* Values are randomly adjusted within valid limits
* This simulates real-time data

---

### 5. Prediction System

Implemented in `parkingUtils.ts`.

The app estimates available spots depending on time:

* current moment
* 30 minutes
* 60 minutes
* evening

Predictions are based on traffic level and current availability.

---

### 6. Favorites

Users can save parking locations as favorites.

* Stored in LocalStorage
* Displayed in the Favorites page

---

### 7. Compare Feature

Users can compare up to 3 parking locations.

The comparison includes:

* distance
* price
* number of free spots
* traffic level
* recommendation score

---

### 8. Parking Details Page

Each parking location has a dedicated page that includes:

* full information
* prediction details
* peak hours
* recommendation score
* navigation button (Google Maps)

---

### 9. Routing

Implemented using React Router.

Available pages:

* Home page (list + filters)
* Parking details page
* Favorites page
* Compare page

---

## Notes

* The application uses mock data (no real API integration)
* The map is simulated (no real map library yet)
* The project is structured to allow future backend integration

---

## Future Improvements

* integration with real parking APIs
* real map integration (Google Maps or Mapbox)
* user authentication
* booking functionality
* improved prediction algorithms

---
