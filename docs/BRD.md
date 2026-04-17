# Business Requirements Document — CoinCheck

## 1. Project Goal
Provide users with a convenient tool to track current cryptocurrency exchange rates and create personalized watchlists.

## 2. Stakeholders
| Stakeholder | Role |
|---------|------|
| End User | Views exchange rates, manages watchlist |
| Developer | Maintains and develops the system |

## 3. Business Requirements
- BR-01: User must be able to register and log into the system
- BR-02: System must display current coin exchange rates
- BR-03: Authorized user can add coins to watchlist
- BR-04: System must be accessible through a browser without additional software

## 4. Functional Requirements
- FR-01: Registration form with email and password validation
- FR-02: Coin list with price and daily percentage change
- FR-03: "Add to Watchlist" button on each coin
- FR-04: Profile page with personalized watchlist

## 5. Non-Functional Requirements
- API response time — up to 500 ms
- Responsive UI (mobile-friendly)
- Minimum test coverage — basic unit tests

## 6. Constraints
- Exchange rate data is obtained from a third-party API (CoinGecko or similar)
- MVP does not include payment functionality