import asyncio
from sqlalchemy import text
from app.infrastructure.db.session import engine

async def check_table():
    async with engine.connect() as conn:
        result = await conn.execute(text(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        ))
        tables = [row[0] for row in result.fetchall()]
        print(f"Tables found: {tables}")
        
        if "news" in tables:
            print("SUCCESS: 'news' table exists.")
            # Check columns
            cols = await conn.execute(text(
                "SELECT column_name FROM information_schema.columns WHERE table_name = 'news'"
            ))
            columns = [row[0] for row in cols.fetchall()]
            print(f"Columns: {columns}")
        else:
            print("FAILURE: 'news' table NOT found.")

if __name__ == "__main__":
    asyncio.run(check_table())
