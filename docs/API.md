# API Documentation — CoinCheck


> Format: OpenAPI 3.0 (can be imported into Swagger Editor or Postman)

## Endpoint 1 — Get List of Coins

**GET** `/api/coins`

**Description:** Returns a list of cryptocurrencies with current exchange rates.

**Response 200:**
```json
[
    {
        "id": "bitcoin",
        "name": "Bitcoin",
        "symbol": "BTC",
        "price_usd": 62000.50,
        "change_24h": 1.23
    }
]
```

**Response Codes:**
| Code | Description |
|------|-------------|
| 200 | List returned successfully |
| 500 | Server error |

---

## Endpoint 2 — Add Coin to Watchlist

**POST** `/api/watchlist`

**Description:** Adds a coin to the watchlist of an authorized user.

**Headers:** `Authorization: Bearer <session_token>`

**Request Body:**
```json
{
    "coinId": "bitcoin"
}
```

**Response 201:**
```json
{
    "message": "Added to watchlist",
    "coinId": "bitcoin"
}
```

**Response Codes:**
| Code | Description |
|------|-------------|
| 201 | Coin added |
| 401 | Unauthorized |
| 400 | Invalid data |