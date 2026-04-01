import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def main():
    # Direct port 5432
    db_url = "postgresql://postgres:postgres@db.cooqpujdoiueduhsoxch.supabase.co:5432/postgres"
    
    if not db_url:
        print("Error: DATABASE_URL not found in environment.")
        return
        
    print(f"Connecting to database...")
    try:
        conn = await asyncpg.connect(db_url)
        print("Connected.")
        
        # Add sku
        try:
            await conn.execute("ALTER TABLE items ADD COLUMN sku VARCHAR(255);")
            print("Added column 'sku' successfully.")
        except asyncpg.exceptions.DuplicateColumnError:
            print("Column 'sku' already exists.")
            
        # Add storage_location
        try:
            await conn.execute("ALTER TABLE items ADD COLUMN storage_location VARCHAR(255);")
            print("Added column 'storage_location' successfully.")
        except asyncpg.exceptions.DuplicateColumnError:
            print("Column 'storage_location' already exists.")
            
        await conn.close()
        print("Migration complete.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
