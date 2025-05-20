# PhD Opportunities Search Backend

This is the backend for the AI-driven PhD opportunity search application.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file with your configuration (see `.env.example`).

3. Run the development server:
   ```
   python app.py
   ```

## API Endpoints

- `GET /api/opportunities` - Get all PhD opportunities
- `GET /api/opportunity/<id>` - Get a specific PhD opportunity
- `POST /api/search` - Advanced search with multiple criteria

## Searching

For the POST `/api/search` endpoint, send a JSON with the following structure:

```json
{
  "keywords": "AI",
  "university": "Stanford",
  "department": "Computer",
  "funding": "full"
}
```
